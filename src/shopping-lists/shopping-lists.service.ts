import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Brackets, Connection, Repository, In } from 'typeorm';
import { ShoppingListsCreateInput } from './inputs/shopping-lists-create.input';
import { ShoppingListsUpdateInput } from './inputs/shopping-lists-update.input';
import { ShoppingList } from './shopping-list.entity';
import { ListProduct } from '../list-products/list-product.entity';
import { ListProductsCreateInput } from '../list-products/inputs/list-products-create.input';
import { UsersService } from '../users/users.service';

@Injectable()
export class ShoppingListsService {
  constructor(
    @InjectRepository(ShoppingList)
    private shoppingListsRepository: Repository<ShoppingList>,
    private usersService: UsersService,
    private connection: Connection,
  ) {}

  findAll(): Promise<ShoppingList[]> {
    return this.shoppingListsRepository.find({
      relations: ['user', 'listProducts', 'sharedUsers'],
      order: { date: 'DESC' },
    });
  }

  async findAllByUser(userId: string): Promise<ShoppingList[]> {
    const shoppingLists = await this.shoppingListsRepository
      .createQueryBuilder('shoppingList')
      .leftJoinAndSelect('shoppingList.user', 'user')
      .leftJoinAndSelect('shoppingList.sharedUsers', 'sharedUsers')
      .leftJoinAndSelect('shoppingList.listProducts', 'listProducts')
      .where('user.id = :id', { id: userId })
      .orWhere('sharedUsers.id = :id', { id: userId })
      .orderBy('date', 'DESC')
      .getMany();

    return shoppingLists;
  }

  findOne(id: string): Promise<ShoppingList> {
    return this.shoppingListsRepository.findOne(id, {
      relations: ['listProducts', 'user', 'sharedUsers'],
    });
  }

  async findOneByUser(id: string, userId: string): Promise<ShoppingList> {
    const shoppingList = await this.shoppingListsRepository
      .createQueryBuilder('shoppingList')
      .leftJoinAndSelect('shoppingList.user', 'user')
      .leftJoinAndSelect('shoppingList.sharedUsers', 'sharedUsers')
      .leftJoinAndSelect('shoppingList.listProducts', 'listProducts')
      .where('shoppingList.id = :id', { id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('user.id = :userId', { userId }).orWhere(
            'sharedUsers.id = :userId',
            { userId },
          );
        }),
      )
      .orderBy('date', 'DESC')
      .getOne();

    return shoppingList;
  }

  async create(
    data: ShoppingListsCreateInput,
    userId: string,
    listProducts?: ListProductsCreateInput[],
  ): Promise<ShoppingList> {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found!');

    const shoppingList = new ShoppingList();

    Object.assign(shoppingList, data, { listProducts, user });

    return await this.shoppingListsRepository.save(shoppingList);
  }

  async createShoppingListFromPendingProducts(
    ids: string[],
    userId: string,
    data: ShoppingListsCreateInput,
    remove: boolean,
  ) {
    return await this.connection.transaction(async (manager) => {
      const user = await manager.findOne<User>(User, userId);
      if (!user) throw new NotFoundException('User not found!');

      const listProductsPending = await manager.find<ListProduct>(ListProduct, {
        where: { shoppingList: In(ids), purchased: false },
        order: { name: 'ASC' },
      });

      const products = listProductsPending.map((item) => {
        const listProduct: ListProductsCreateInput = {
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          brand: item.brand,
          market: item.market,
          purchased: false,
        };

        return listProduct;
      });

      const shoppingList = new ShoppingList();
      Object.assign(shoppingList, data, { listProducts: products, user });

      await manager.save(shoppingList);

      if (remove) {
        await manager.remove<ListProduct>(ListProduct, listProductsPending);
      }

      return shoppingList;
    });
  }

  async createShoppingListFromShoppingLists(
    ids: string[],
    userId: string,
    data: ShoppingListsCreateInput,
  ) {
    return await this.connection.transaction(async (manager) => {
      const user = await manager.findOne<User>(User, userId);
      if (!user) throw new NotFoundException('User not found!');

      const listProducts = await manager.find<ListProduct>(ListProduct, {
        where: { shoppingList: In(ids) },
        order: { name: 'ASC' },
      });

      const products: ListProductsCreateInput[] = [];
      listProducts.forEach((item) => {
        const index = products.findIndex(
          (product) => product.name === item.name,
        );

        if (index < 0) {
          const listProduct: ListProductsCreateInput = {
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            brand: item.brand,
            market: item.market,
            purchased: false,
          };

          products.push(listProduct);
        } else {
          products[index].quantity += item.quantity;
        }
      });

      const shoppingList = new ShoppingList();
      Object.assign(shoppingList, data, { listProducts: products, user });

      await manager.save(shoppingList);

      return shoppingList;
    });
  }

  async update(
    id: string,
    values: ShoppingListsUpdateInput,
  ): Promise<ShoppingList> {
    const shoppingList = await this.findOne(id);
    if (!shoppingList) throw new NotFoundException('User not found!');

    Object.assign(shoppingList, values);

    await this.shoppingListsRepository.save(shoppingList);

    return shoppingList;
  }

  async addSharedUsersToShoppingList(
    id: string,
    userId: string,
  ): Promise<ShoppingList> {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found!');

    const shoppingList = await this.findOne(id);
    if (!shoppingList) throw new NotFoundException('Shopping List not found!');

    const users = new Set(shoppingList.sharedUsers.concat(user));

    shoppingList.sharedUsers = [...users];

    await this.shoppingListsRepository.save(shoppingList);

    return shoppingList;
  }

  async deleteSharedUserFromShoppingList(
    id: string,
    userId: string,
  ): Promise<ShoppingList> {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found!');

    const shoppingList = await this.findOne(id);
    if (!shoppingList) throw new NotFoundException('Shopping List not found!');

    const index = shoppingList.sharedUsers.findIndex(
      (sharedUser) => sharedUser.id === user.id,
    );
    if (index < 0) throw new NotFoundException('Shared User not found');

    shoppingList.sharedUsers.splice(index, 1);

    await this.shoppingListsRepository.save(shoppingList);

    return shoppingList;
  }

  async delete(id: string): Promise<void> {
    await this.shoppingListsRepository.delete(id);
  }
}

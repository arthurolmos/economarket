import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Brackets, Connection, Repository, In } from 'typeorm';
import { ShoppingListsCreateInput } from './inputs/shopping-lists-create.input';
import { ShoppingListsUpdateInput } from './inputs/shopping-lists-update.input';
import { ShoppingList } from './shopping-list.entity';
import { ListProduct } from '../list-products/list-product.entity';
import { ListProductsCreateInput } from '../list-products/inputs/list-products-create.input';

@Injectable()
export class ShoppingListsService {
  constructor(
    @InjectRepository(ShoppingList)
    private shoppingListsRepository: Repository<ShoppingList>,
    private connection: Connection,
  ) {}

  findAll(): Promise<ShoppingList[]> {
    return this.shoppingListsRepository.find({
      relations: ['user', 'listProducts', 'sharedUsers'],
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
    user: User,
    listProducts?: ListProductsCreateInput[],
  ): Promise<ShoppingList> {
    const shoppingList = new ShoppingList();

    Object.assign(shoppingList, data);
    shoppingList.listProducts = listProducts as ListProduct[];
    shoppingList.user = user;

    return await this.shoppingListsRepository.save(shoppingList);
  }

  async createShoppingListFromPendingProducts(
    ids: string[],
    userId: string,
    remove: boolean,
  ) {
    return await this.connection.transaction(async (manager) => {
      const user = await manager.findOne<User>(User, userId);
      if (!user) throw new Error('User not found!');

      const listProductsPending = await manager.find<ListProduct>(ListProduct, {
        where: { shoppingList: In(ids), purchased: false },
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

      const data: ShoppingListsCreateInput = {
        name: 'Lista ' + new Date().toLocaleString(),
        date: new Date(),
      };

      const shoppingList = new ShoppingList();
      Object.assign(shoppingList, data);
      shoppingList.listProducts = products as ListProduct[];
      shoppingList.user = user;

      await manager.save(shoppingList);

      if (remove) {
        await manager.remove<ListProduct>(ListProduct, listProductsPending);
      }

      return shoppingList;
    });
  }

  async createShoppingListFromShoppingLists(ids: string[], userId: string) {
    return await this.connection.transaction(async (manager) => {
      const user = await manager.findOne<User>(User, userId);
      if (!user) throw new Error('User not found!');

      const listProducts = await manager.find<ListProduct>(ListProduct, {
        where: { shoppingList: In(ids) },
        order: { name: 'DESC' },
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

      const data: ShoppingListsCreateInput = {
        name: 'Lista ' + new Date().toLocaleString(),
        date: new Date(),
      };

      const shoppingList = new ShoppingList();
      Object.assign(shoppingList, data);
      shoppingList.listProducts = products as ListProduct[];
      shoppingList.user = user;

      console.log({ shoppingList });

      await manager.save(shoppingList);

      return shoppingList;
    });
  }

  async update(
    id: string,
    values: ShoppingListsUpdateInput,
    userId: string,
  ): Promise<ShoppingList> {
    const shoppingList = await this.findOne(id);
    if (!shoppingList) throw new Error();

    Object.assign(shoppingList, values);

    await this.shoppingListsRepository.save(shoppingList);

    return shoppingList;
  }

  async addSharedUsersToShoppingList(
    id: string,
    sharedUser: User,
  ): Promise<ShoppingList> {
    const shoppingList = await this.findOne(id);
    if (!shoppingList) throw new Error();

    const users = new Set(shoppingList.sharedUsers.concat(sharedUser));

    shoppingList.sharedUsers = [...users];

    await this.shoppingListsRepository.save(shoppingList);

    return shoppingList;
  }

  async deleteSharedUserFromShoppingList(
    id: string,
    user: User,
  ): Promise<ShoppingList> {
    const shoppingList = await this.findOne(id);
    if (!shoppingList) throw new Error();

    const index = shoppingList.sharedUsers.findIndex(
      (sharedUser) => sharedUser.id === user.id,
    );
    if (index < 0) throw new Error('User not found');

    shoppingList.sharedUsers.splice(index, 1);

    await this.shoppingListsRepository.save(shoppingList);

    return shoppingList;
  }

  async delete(id: string): Promise<void> {
    await this.shoppingListsRepository.delete(id);
  }
}

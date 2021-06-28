import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { ShoppingListsCreateInput } from './inputs/shopping-lists-create.input';
import { ShoppingListsUpdateInput } from './inputs/shopping-lists-update.input';
import { ShoppingList } from './shopping-list.entity';

@Injectable()
export class ShoppingListsService {
  constructor(
    @InjectRepository(ShoppingList)
    private shoppingListsRepository: Repository<ShoppingList>,
  ) {}

  findAll(): Promise<ShoppingList[]> {
    return this.shoppingListsRepository.find({
      relations: ['user', 'listProducts', 'sharedUsers'],
    });
  }

  findAllByUser(userId: string): Promise<ShoppingList[]> {
    return this.shoppingListsRepository.find({ where: { user: userId } });
  }

  findOne(id: string): Promise<ShoppingList> {
    return this.shoppingListsRepository.findOne(id, {
      relations: ['listProducts', 'user', 'sharedUsers'],
    });
  }

  findOneByUser(id: string, userId: string): Promise<ShoppingList> {
    return this.shoppingListsRepository.findOne({
      where: { user: userId, id },
      relations: ['user', 'sharedUsers'],
    });
  }

  async create(
    data: ShoppingListsCreateInput,
    user: User,
  ): Promise<ShoppingList> {
    const shoppingList = new ShoppingList();

    Object.assign(shoppingList, data);
    shoppingList.user = user;

    return await this.shoppingListsRepository.save(shoppingList);
  }

  async update(
    id: string,
    values: ShoppingListsUpdateInput,
    userId: string,
  ): Promise<ShoppingList> {
    const shoppingList = await this.findOneByUser(id, userId);
    if (!shoppingList) throw new Error();

    Object.assign(shoppingList, values);

    await this.shoppingListsRepository.save(shoppingList);

    return shoppingList;
  }

  async addSharedUsersToShoppingList(
    id: string,
    userId: string,
    sharedUsers: User[],
  ): Promise<ShoppingList> {
    const shoppingList = await this.findOneByUser(id, userId);
    if (!shoppingList) throw new Error();

    const users = new Set(shoppingList.sharedUsers.concat(sharedUsers));

    shoppingList.sharedUsers = [...users];

    await this.shoppingListsRepository.save(shoppingList);

    return shoppingList;
  }

  async removeSharedUsersFromShoppingList(
    id: string,
    userId: string,
    sharedUsers: User[],
  ): Promise<ShoppingList> {
    const shoppingList = await this.findOneByUser(id, userId);
    if (!shoppingList) throw new Error();

    const ids = shoppingList.sharedUsers.map((user) => user.id);

    const index = [];
    sharedUsers.forEach((user) => {
      const i = ids.indexOf(user.id);

      index.push(i);
    });

    index.forEach((i) => {
      shoppingList.sharedUsers.splice(i, 1);
    });

    await this.shoppingListsRepository.save(shoppingList);

    return shoppingList;
  }

  async remove(id: string): Promise<void> {
    await this.shoppingListsRepository.delete(id);
  }
}

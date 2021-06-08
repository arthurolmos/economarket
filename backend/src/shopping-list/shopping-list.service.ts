import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { ShoppingListCreateInput } from './inputs/shopping-list-create.input';
import { ShoppingListUpdateInput } from './inputs/shopping-list-update.input';
import { ShoppingList } from './shopping-list.entity';

@Injectable()
export class ShoppingListService {
  constructor(
    @InjectRepository(ShoppingList)
    private shoppingListsRepository: Repository<ShoppingList>,
  ) {}

  findAll(): Promise<ShoppingList[]> {
    return this.shoppingListsRepository.find({ relations: ['user'] });
  }

  findAllByUser(userId: string): Promise<ShoppingList[]> {
    return this.shoppingListsRepository.find({ where: { user: userId } });
  }

  findOne(id: string): Promise<ShoppingList> {
    return this.shoppingListsRepository.findOne(id);
  }

  async create(
    data: ShoppingListCreateInput,
    user: User,
  ): Promise<ShoppingList> {
    const shoppingList = new ShoppingList();
    shoppingList.name = data.name && data.name;
    shoppingList.date = data.date;
    shoppingList.user = user;

    return await this.shoppingListsRepository.save(shoppingList);
  }

  async update(
    id: string,
    values: ShoppingListUpdateInput,
  ): Promise<ShoppingList> {
    const { name, date, done } = values;

    await this.shoppingListsRepository.update(id, { name, date, done });

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.shoppingListsRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.shoppingListsRepository.restore(id);
  }
}

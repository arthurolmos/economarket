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
      relations: ['user', 'listProducts'],
    });
  }

  findAllByUser(userId: string): Promise<ShoppingList[]> {
    return this.shoppingListsRepository.find({ where: { user: userId } });
  }

  findOne(id: string): Promise<ShoppingList> {
    return this.shoppingListsRepository.findOne(id, {
      relations: ['listProducts', 'user'],
    });
  }

  findOneByUser(id: string, userId: string): Promise<ShoppingList> {
    return this.shoppingListsRepository.findOne({
      where: { user: userId, id },
      relations: ['user'],
    });
  }

  async create(
    data: ShoppingListsCreateInput,
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
    values: ShoppingListsUpdateInput,
  ): Promise<ShoppingList> {
    const { name, date, done } = values;

    await this.shoppingListsRepository.update(id, { name, date, done });

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.shoppingListsRepository.delete(id);
  }
}

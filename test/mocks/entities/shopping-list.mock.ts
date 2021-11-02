import { MockUser } from './user.mock';
import { ShoppingList } from '../../../src/shopping-lists/shopping-list.entity';
import * as faker from 'faker';
import { User } from '../../../src/users/user.entity';

export class MockShoppingList extends ShoppingList {
  constructor(
    user: User | MockUser = new MockUser(),
    name = faker.music.genre(),
    done = false,
  ) {
    super();

    this.id = faker.datatype.uuid();
    this.name = name;
    this.date = new Date();
    this.done = done;

    this.user = user;

    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

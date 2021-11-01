import * as faker from 'faker';
import { User } from '../../../src/users/user.entity';
import { Notification } from '../../../src/notifications/notification.entity';
import { MockUser } from './MockUser';

export class MockNotification extends Notification {
  constructor(
    user: User | MockUser = new MockUser(),
    title = faker.lorem.words(),
    body = faker.lorem.text(),
    read = false,
  ) {
    super();

    this.id = faker.datatype.uuid();
    this.title = title;
    this.body = body;
    this.read = read;

    this.user = user;

    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

import * as faker from 'faker';
import { User } from '../../../src/users/user.entity';
import { PushNotificationToken } from '../../../src/push-notification-tokens/push-notification-token.entity';
import { MockUser } from './user.mock';

export class MockPushNotificationToken extends PushNotificationToken {
  constructor(
    user: User | MockUser = new MockUser(),
    token = 'ExpoPushToken:' + faker.lorem.words(),
  ) {
    super();

    this.id = faker.datatype.uuid();
    this.token = token;

    this.user = user;

    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

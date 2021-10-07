import * as faker from 'faker';
import { PushNotificationToken } from '../../src/push-notification-tokens/push-notification-token.entity';
import { MockUser } from './MockUser';

export class MockPushNotificationToken extends PushNotificationToken {
  constructor(
    user = new MockUser(),
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

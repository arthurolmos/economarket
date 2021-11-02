import { PushNotificationTokensService } from '../../../src/push-notification-tokens/push-notification-tokens.service';

export class MockPushNotificationTokensService extends PushNotificationTokensService {
  constructor() {
    super(null, null);
  }

  checkToken = jest.fn();
  deleteAll = jest.fn();
  findAllByToken = jest.fn();
  findAllByUser = jest.fn();
  findOneByUser = jest.fn();
  create = jest.fn();
  delete = jest.fn();
  findAll = jest.fn();
  findOne = jest.fn();
}

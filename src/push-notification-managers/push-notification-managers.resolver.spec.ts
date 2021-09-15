import { Test, TestingModule } from '@nestjs/testing';
import { PushNotificationManagersResolver } from './push-notification-managers.resolver';

describe('PushNotificationManagersResolver', () => {
  let resolver: PushNotificationManagersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PushNotificationManagersResolver],
    }).compile();

    resolver = module.get<PushNotificationManagersResolver>(
      PushNotificationManagersResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

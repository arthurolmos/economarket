import { Test, TestingModule } from '@nestjs/testing';
import {
  MockPushNotificationToken,
  MockPushNotificationTokensService,
} from '../../test/mocks';
import { PushNotificationToken } from './push-notification-token.entity';
import { PushNotificationTokensResolver } from './push-notification-tokens.resolver';
import { PushNotificationTokensService } from './push-notification-tokens.service';

describe('PushNotificationTokensResolver', () => {
  let resolver: PushNotificationTokensResolver;

  const service = new MockPushNotificationTokensService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PushNotificationTokensResolver,
        {
          provide: PushNotificationTokensService,
          useValue: service,
        },
      ],
    }).compile();

    resolver = module.get<PushNotificationTokensResolver>(
      PushNotificationTokensResolver,
    );

    jest.clearAllMocks();
  });

  describe('getPushNotificationTokens', () => {
    let pushNotificationTokens: PushNotificationToken[];

    beforeEach(() => {
      pushNotificationTokens = [];

      for (let i = 0; i < 5; i++) {
        const pushNotificationToken = new MockPushNotificationToken();
        pushNotificationTokens.push(pushNotificationToken);
      }
    });

    it('should return all notification Tokens', async () => {
      service.findAll.mockReturnValue(pushNotificationTokens);

      const tokens = await resolver.getPushNotificationTokens();

      expect(tokens).toBeDefined();
      expect(tokens).toHaveLength(5);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

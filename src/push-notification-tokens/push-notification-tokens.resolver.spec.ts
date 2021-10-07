import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { MockRepository, MockPushNotificationToken } from '../../test/mocks';
import { PushNotificationToken } from './push-notification-token.entity';
import { PushNotificationTokensResolver } from './push-notification-tokens.resolver';
import { User } from '../users/user.entity';
import { PushNotificationTokensService } from './push-notification-tokens.service';

describe('PushNotificationTokensResolver', () => {
  let resolver: PushNotificationTokensResolver;

  const mockPushNotificationTokensRepository = new MockRepository();
  const mockUsersRepository = new MockRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PushNotificationTokensResolver,
        PushNotificationTokensService,
        UsersService,
        {
          provide: getRepositoryToken(PushNotificationToken),
          useValue: mockPushNotificationTokensRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    resolver = module.get<PushNotificationTokensResolver>(
      PushNotificationTokensResolver,
    );

    jest.clearAllMocks();
  });

  describe('getPushNotificationTokens', () => {
    const pushNotificationTokens: PushNotificationToken[] = [];

    beforeEach(() => {
      for (let i = 0; i < 5; i++) {
        const pushNotificationToken = new MockPushNotificationToken();
        pushNotificationTokens.push(pushNotificationToken);
      }
    });

    it('should return all notification Tokens', async () => {
      mockPushNotificationTokensRepository.find.mockReturnValue(
        pushNotificationTokens,
      );

      const tokens = await resolver.getPushNotificationTokens();

      expect(tokens).toBeDefined();
      expect(tokens).toHaveLength(5);
      expect(mockPushNotificationTokensRepository.find).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

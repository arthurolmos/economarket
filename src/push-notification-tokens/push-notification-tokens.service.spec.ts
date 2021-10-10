import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import {
  MockRepository,
  MockPushNotificationToken,
  MockUser,
} from '../../test/mocks';
import { PushNotificationTokensCreateInput } from './input/push-notification-tokens-create.input';
import { PushNotificationToken } from './push-notification-token.entity';
import { PushNotificationTokensService } from './push-notification-tokens.service';

describe('PushNotificationTokensService', () => {
  let service: PushNotificationTokensService;

  const mockPushNotificationTokensRepository = new MockRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PushNotificationTokensService,
        {
          provide: getRepositoryToken(PushNotificationToken),
          useValue: mockPushNotificationTokensRepository,
        },
      ],
    }).compile();

    service = module.get<PushNotificationTokensService>(
      PushNotificationTokensService,
    );

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    let pushNotificationTokens: PushNotificationToken[];

    beforeEach(() => {
      pushNotificationTokens = [];

      for (let i = 0; i < 5; i++) {
        const pushNotificationToken = new MockPushNotificationToken();
        pushNotificationTokens.push(pushNotificationToken);
      }
    });

    it('should return all PushNotificationTokens', async () => {
      mockPushNotificationTokensRepository.find.mockReturnValue(
        pushNotificationTokens,
      );

      const tokens = await service.findAll();

      expect(tokens).toBeDefined();
      expect(tokens).toHaveLength(5);
      expect(mockPushNotificationTokensRepository.find).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  describe('findAllByUser', () => {
    let mockUser: User;
    let pushNotificationTokens: PushNotificationToken[];

    beforeEach(() => {
      mockUser = new MockUser();
      pushNotificationTokens = [];

      for (let i = 0; i < 2; i++) {
        const pushNotificationToken = new MockPushNotificationToken(mockUser);
        pushNotificationTokens.push(pushNotificationToken);
      }
    });

    it('should return all PushNotificationTokens from User by passing user Id', async () => {
      const userId = mockUser.id;
      mockPushNotificationTokensRepository.find.mockReturnValue(
        pushNotificationTokens,
      );

      const tokens = await service.findAllByUser(userId);

      expect(tokens).toBeDefined();
      expect(tokens).toHaveLength(2);
      expect(mockPushNotificationTokensRepository.find).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  describe('findAllByToken', () => {
    let mockUser: User;
    let token: string;
    let pushNotificationTokens: PushNotificationToken[];

    beforeEach(() => {
      mockUser = new MockUser();
      token = 'token';
      pushNotificationTokens = [];

      for (let i = 0; i < 2; i++) {
        const pushNotificationToken = new MockPushNotificationToken(
          mockUser,
          token,
        );
        pushNotificationTokens.push(pushNotificationToken);
      }
    });

    it('should return all PushNotificationTokens by passing the Token', async () => {
      mockPushNotificationTokensRepository.find.mockReturnValue(
        pushNotificationTokens,
      );

      const tokens = await service.findAllByUser(token);

      expect(tokens).toBeDefined();
      expect(tokens).toHaveLength(2);
      expect(mockPushNotificationTokensRepository.find).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  describe('findOne', () => {
    let pushNotificationToken: PushNotificationToken;

    beforeEach(() => {
      pushNotificationToken = new MockPushNotificationToken();
    });

    it('should return one PushNotificationToken by passing its Id', async () => {
      const id = pushNotificationToken.id;
      mockPushNotificationTokensRepository.findOne.mockReturnValue(
        pushNotificationToken,
      );

      const token = await service.findOne(id);

      expect(token).toBeDefined();
      expect(token).toEqual(pushNotificationToken);
      expect(
        mockPushNotificationTokensRepository.findOne,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneByUser', () => {
    let mockUser: User;
    let pushNotificationToken: PushNotificationToken;

    beforeEach(() => {
      mockUser = new MockUser();

      pushNotificationToken = new MockPushNotificationToken(mockUser);
    });

    it('should return one PushNotificationToken by passing the token and the User Id', async () => {
      const notificationToken = pushNotificationToken.token;
      const userId = mockUser.id;
      mockPushNotificationTokensRepository.findOne.mockReturnValue(
        pushNotificationToken,
      );

      const token = await service.findOneByUser(userId, notificationToken);

      expect(token).toBeDefined();
      expect(token).toEqual(pushNotificationToken);
      expect(
        mockPushNotificationTokensRepository.findOne,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('checkToken', () => {
    let mockUser: User;
    let pushNotificationToken: PushNotificationToken;

    beforeEach(() => {
      mockUser = new MockUser();

      pushNotificationToken = new MockPushNotificationToken(mockUser);
    });

    it('should return one PushNotificationToken by passing the token and the User Id (almost same as findOneByUser)', async () => {
      const notificationToken = pushNotificationToken.token;
      const userId = mockUser.id;
      mockPushNotificationTokensRepository.findOne.mockReturnValue(
        pushNotificationToken,
      );

      const token = await service.checkToken(userId, notificationToken);

      expect(token).toBeDefined();
      expect(token).toEqual(pushNotificationToken);
      expect(
        mockPushNotificationTokensRepository.findOne,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('checkToken', () => {
    let mockUser: User;
    let pushNotificationToken: PushNotificationToken;

    beforeEach(() => {
      mockUser = new MockUser();

      pushNotificationToken = new MockPushNotificationToken(mockUser);
    });

    it('should return one PushNotificationToken by passing the token and the User Id (almost same as findOneByUser)', async () => {
      const notificationToken = pushNotificationToken.token;
      const userId = mockUser.id;
      mockPushNotificationTokensRepository.findOne.mockReturnValue(
        pushNotificationToken,
      );

      const token = await service.checkToken(userId, notificationToken);

      expect(token).toBeDefined();
      expect(token).toEqual(pushNotificationToken);
      expect(
        mockPushNotificationTokensRepository.findOne,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    let mockUser: User;
    let pushNotificationToken: PushNotificationToken;
    let mockData: PushNotificationTokensCreateInput;

    beforeEach(() => {
      mockUser = new MockUser();

      mockData = {
        token: 'token',
        userId: mockUser.id,
      };
    });

    it('should create one PushNotificationToken', async () => {
      pushNotificationToken = new MockPushNotificationToken(
        mockUser,
        mockData.token,
      );
      mockPushNotificationTokensRepository.save.mockReturnValue(
        pushNotificationToken,
      );

      const token = await service.create(mockData.token, mockUser);

      expect(token).toBeDefined();
      expect(token).toEqual(pushNotificationToken);
      expect(mockPushNotificationTokensRepository.save).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  describe('delete', () => {
    let pushNotificationToken: PushNotificationToken;

    beforeEach(() => {
      pushNotificationToken = new MockPushNotificationToken();
    });

    it('should delete a PushNotificationToken by passing its token', async () => {
      const token = pushNotificationToken.token;
      mockPushNotificationTokensRepository.delete.mockReturnValue(
        Promise.resolve(),
      );

      expect(mockPushNotificationTokensRepository.delete(token)).resolves;
      expect(mockPushNotificationTokensRepository.delete).toHaveBeenCalledTimes(
        1,
      );
    });
  });
});

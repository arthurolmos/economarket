import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { NotificationsResolver } from './notifications.resolver';
import { NotificationsService } from './notifications.service';
import { Notification } from './notification.entity';
import { NotificationsCreateInput } from './inputs/notifications-create.input';
import { MockRepository, MockUser, MockNotification } from '../../test/mocks';
import { PushNotificationManagersService } from '../push-notification-managers/push-notification-managers.service';
import { expo } from '../push-notification-managers/expo.provider';
import { PushNotificationTokensService } from '../push-notification-tokens/push-notification-tokens.service';
import { PushNotificationToken } from '../push-notification-tokens/push-notification-token.entity';
import * as faker from 'faker';

describe('NotificationsResolver', () => {
  let resolver: NotificationsResolver;

  const mockNotificationssRepository = new MockRepository();
  const mockUsersRepository = new MockRepository();
  const mockPushNotificationTokensRepository = new MockRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsResolver,
        NotificationsService,
        PushNotificationManagersService,
        PushNotificationTokensService,
        UsersService,
        {
          provide: getRepositoryToken(Notification),
          useValue: mockNotificationssRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
        {
          provide: getRepositoryToken(PushNotificationToken),
          useValue: mockPushNotificationTokensRepository,
        },
        ...expo,
      ],
    }).compile();

    resolver = module.get<NotificationsResolver>(NotificationsResolver);

    jest.clearAllMocks();
  });

  describe('getNotifications', () => {
    const mockNotifications: Notification[] = [];

    beforeEach(() => {
      for (let i = 0; i < 5; i++) {
        const notification = new MockNotification();
        mockNotifications.push(notification);
      }
    });

    it('should return all Notifications', async () => {
      mockNotificationssRepository.find.mockReturnValue(mockNotifications);

      const products = await resolver.getNotifications();

      expect(products).toBeDefined();
      expect(products).toHaveLength(5);
    });
  });

  describe('getNotificationsByUser', () => {
    let mockUser: User;
    const mockNotifications: Notification[] = [];

    beforeEach(() => {
      mockUser = new User();

      for (let i = 0; i < 5; i++) {
        const notification = new MockNotification(mockUser);
        mockNotifications.push(notification);
      }
    });

    it('should return all Notifications by User', async () => {
      const userId = mockUser.id;
      mockNotificationssRepository.find.mockReturnValue(mockNotifications);

      const products = await resolver.getNotificationsByUser(userId);

      expect(products).toBeDefined();
      expect(products).toHaveLength(5);
    });
  });

  describe('getNotification', () => {
    let mockNotification: Notification;

    beforeEach(() => {
      mockNotification = new MockNotification();
    });

    it('should return an Notification by passing its ID', async () => {
      const id = mockNotification.id;
      mockNotificationssRepository.findOne.mockReturnValue(mockNotification);

      const notification = await resolver.getNotification(id);

      expect(notification).toBeDefined();
      expect(notification).toEqual(mockNotification);
      expect(mockNotificationssRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('createNotification', () => {
    let mockUser: User;
    let mockNotification: Notification;

    beforeEach(() => {
      mockUser = new MockUser();
    });

    it('should create a new Notification and returns it', async () => {
      const mockData: NotificationsCreateInput = {
        title: faker.lorem.words(),
        body: faker.lorem.text(),
      };
      mockNotification = new MockNotification(
        mockUser,
        mockData.title,
        mockData.body,
      );
      mockNotificationssRepository.save.mockReturnValue(mockNotification);
      mockUsersRepository.findOne.mockReturnValue(mockUser);
      const userId = mockUser.id;

      const notification = await resolver.createNotification(mockData, userId);

      expect(notification).toBeDefined();
      expect(notification).toEqual(mockNotification);
      expect(mockNotificationssRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if User not found', async () => {
      const mockData: NotificationsCreateInput = {
        title: faker.lorem.words(),
        body: faker.lorem.text(),
      };
      const userId = 'invalidId';
      mockUsersRepository.findOne.mockReturnValue(null);

      try {
        await resolver.createNotification(mockData, userId);
      } catch (err) {
        expect(err).toMatch('User not found!');
      }
    });
  });

  describe('deleteNotification', () => {
    let mockNotification: Notification;

    beforeEach(() => {
      mockNotification = new MockNotification();
    });

    it('should delete an Notification', async () => {
      const id = mockNotification.id;
      mockNotificationssRepository.delete.mockReturnValue(Promise.resolve());

      expect(await resolver.deleteNotification(id)).resolves;
      expect(mockNotificationssRepository.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteAllNotification', () => {
    it('should delete all Notifications', async () => {
      mockNotificationssRepository.delete.mockReturnValue(Promise.resolve());

      expect(await resolver.deleteAllNotifications()).resolves;
      expect(mockNotificationssRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});

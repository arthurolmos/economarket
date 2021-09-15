import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { NotificationsResolver } from './notifications.resolver';
import { NotificationsService } from './notifications.service';
import { Notification } from './notification.entity';
import * as faker from 'faker';
import { NotificationsCreateInput } from './inputs/notifications-create.input';

describe('NotificationsResolver', () => {
  let resolver: NotificationsResolver;

  const mockNotificationssRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    restore: jest.fn(),
  };

  const mockUsersRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    restore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsResolver,
        NotificationsService,
        {
          provide: getRepositoryToken(Notification),
          useValue: mockNotificationssRepository,
        },
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    resolver = module.get<NotificationsResolver>(NotificationsResolver);

    jest.clearAllMocks();
  });

  describe('getNotifications', () => {
    const mockNotifications: Notification[] = [];

    beforeAll(() => {
      const user = new User();
      user.id = faker.datatype.uuid();

      for (let i = 0; i < 5; i++) {
        const notification = new Notification();
        notification.title = faker.lorem.words();
        notification.body = faker.lorem.text();

        notification.user = user;

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
    const mockNotifications: Notification[] = [];
    const users: User[] = [];

    beforeAll(() => {
      for (let i = 0; i < 2; i++) {
        const user = new User();
        user.id = faker.datatype.uuid();

        users.push(user);
      }

      for (let i = 0; i < 5; i++) {
        const notification = new Notification();
        notification.title = faker.lorem.words();
        notification.body = faker.lorem.text();

        notification.user = users[i % 2];

        mockNotifications.push(notification);
      }
    });

    it('should return all Notifications by User', async () => {
      mockNotificationssRepository.find.mockReturnValue(
        mockNotifications.filter(
          (notification) => notification.user.id === users[1].id,
        ),
      );

      const products = await resolver.getNotificationsByUser(users[1].id);

      expect(products).toBeDefined();
      expect(products).toHaveLength(2);
    });
  });

  describe('getNotification', () => {
    const mockNotification = new Notification();

    beforeAll(() => {
      mockNotification.id = faker.datatype.uuid();
      mockNotification.title = faker.lorem.words();
      mockNotification.body = faker.lorem.text();
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
    let mockData: NotificationsCreateInput;
    const user = new User();

    beforeAll(() => {
      user.id = faker.datatype.uuid();

      mockData = {
        title: faker.lorem.words(),
        body: faker.lorem.text(),
      };
    });

    it('should create a new Notification and returns it', async () => {
      const mockNotification = new Notification();
      mockNotification.title = mockData.title;
      mockNotification.body = mockData.body;
      mockNotificationssRepository.save.mockReturnValue(mockNotification);
      mockUsersRepository.findOne.mockReturnValue(user);
      const userId = user.id;

      const notification = await resolver.createNotification(mockData, userId);

      expect(notification).toBeDefined();
      expect(notification).toEqual(mockNotification);
      expect(mockNotificationssRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if User not found', async () => {
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
    const mockNotification = new Notification();

    beforeAll(() => {
      mockNotification.id = faker.datatype.uuid();
      mockNotification.title = faker.lorem.words();
      mockNotification.body = faker.lorem.text();
    });

    it('should delete an Notification', async () => {
      const id = mockNotification.id;
      mockNotificationssRepository.delete.mockReturnValue(Promise.resolve());

      expect(await resolver.deleteNotification(id)).resolves;
      expect(mockNotificationssRepository.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteAllNotification', () => {
    const mockNotification = new Notification();

    beforeAll(() => {
      mockNotification.id = faker.datatype.uuid();
      mockNotification.title = faker.lorem.words();
      mockNotification.body = faker.lorem.text();
    });

    it('should delete all Notifications', async () => {
      mockNotificationssRepository.delete.mockReturnValue(Promise.resolve());

      expect(await resolver.deleteAllNotifications()).resolves;
      expect(mockNotificationssRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});

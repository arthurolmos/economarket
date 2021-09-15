import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { NotificationsService } from './notifications.service';
import * as faker from 'faker';
import { Notification } from './notification.entity';
import { NotificationsCreateInput } from './inputs/notifications-create.input';

describe('NotificationsService', () => {
  let service: NotificationsService;

  const mockNotificationsRepository = {
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
        NotificationsService,
        {
          provide: getRepositoryToken(Notification),
          useValue: mockNotificationsRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    const mockNotifications: Notification[] = [];

    beforeAll(() => {
      for (let i = 0; i < 5; i++) {
        const notification = new Notification();
        notification.title = faker.lorem.words();
        notification.body = faker.lorem.text();

        mockNotifications.push(notification);
      }
    });

    it('should find all Notifications ', async () => {
      mockNotificationsRepository.find.mockReturnValue(mockNotifications);

      const notifications = await service.findAll();

      expect(notifications).toBeDefined();
      expect(notifications).toHaveLength(5);
      expect(mockNotificationsRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllByUser', () => {
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

    it('should find all Notifications by User', async () => {
      mockNotificationsRepository.find.mockReturnValue(
        mockNotifications.filter(
          (notification) => notification.user.id === users[1].id,
        ),
      );

      const notifications = await service.findAllByUser(users[1].id);

      expect(notifications).toBeDefined();
      expect(notifications).toHaveLength(2);
      expect(mockNotificationsRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    const mockNotification = new Notification();

    beforeAll(() => {
      mockNotification.id = faker.datatype.uuid();
      mockNotification.title = faker.lorem.words();
      mockNotification.body = faker.lorem.text();
    });

    it('should find an Notification by passing its ID ', async () => {
      const id = mockNotification.id;
      mockNotificationsRepository.findOne.mockReturnValue(mockNotification);

      const notification = await service.findOne(id);

      expect(notification).toBeDefined();
      expect(notification).toEqual(mockNotification);
      expect(mockNotificationsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    let mockData: NotificationsCreateInput;
    const user = new User();

    beforeAll(() => {
      mockData = {
        title: faker.lorem.words(),
        body: faker.lorem.text(),
      };
    });

    it('should create a new Notification and returns it', async () => {
      const mockNotification = new Notification();
      mockNotification.title = mockData.title;
      mockNotification.body = mockData.body;
      mockNotificationsRepository.save.mockReturnValue(mockNotification);
      mockUsersRepository.findOne.mockReturnValue(user);

      const notification = await service.create(mockData, user);

      expect(notification).toBeDefined();
      expect(notification).toEqual(mockNotification);
      expect(mockNotificationsRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    const mockNotification = new Notification();

    beforeAll(() => {
      mockNotification.id = faker.datatype.uuid();
      mockNotification.title = faker.lorem.word();
      mockNotification.body = faker.lorem.text();
    });

    it('should soft delete an Notification', async () => {
      const id = mockNotification.id;
      mockNotificationsRepository.delete.mockReturnValue(Promise.resolve());

      expect(await service.delete(id)).resolves;
      expect(mockNotificationsRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});

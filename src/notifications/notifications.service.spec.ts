import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { NotificationsService } from './notifications.service';
import { Notification } from './notification.entity';
import { NotificationsCreateInput } from './inputs/notifications-create.input';
import { MockRepository, MockNotification, MockUser } from '../../test/mocks';
import * as faker from 'faker';

describe('NotificationsService', () => {
  let service: NotificationsService;

  const mockNotificationsRepository = new MockRepository();
  const mockUsersRepository = new MockRepository();

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

    beforeEach(() => {
      for (let i = 0; i < 5; i++) {
        const notification = new MockNotification();
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
    let mockUser: User;
    const mockNotifications: Notification[] = [];

    beforeEach(() => {
      mockUser = new MockUser();
      for (let i = 0; i < 5; i++) {
        const notification = new MockNotification(mockUser);
        mockNotifications.push(notification);
      }
    });

    it('should find all Notifications by User', async () => {
      const userId = mockUser.id;
      mockNotificationsRepository.find.mockReturnValue(mockNotifications);

      const notifications = await service.findAllByUser(userId);

      expect(notifications).toBeDefined();
      expect(notifications).toHaveLength(5);
      expect(mockNotificationsRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    let mockNotification: Notification;

    beforeEach(() => {
      mockNotification = new MockNotification();
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
      mockNotificationsRepository.save.mockReturnValue(mockNotification);
      mockUsersRepository.findOne.mockReturnValue(mockUser);

      const notification = await service.create(mockData, mockUser);

      expect(notification).toBeDefined();
      expect(notification).toEqual(mockNotification);
      expect(mockNotificationsRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    let mockNotification: Notification;

    beforeEach(() => {
      mockNotification = new MockNotification();
    });

    it('should soft delete an Notification', async () => {
      const id = mockNotification.id;
      mockNotificationsRepository.delete.mockReturnValue(Promise.resolve());

      expect(await service.delete(id)).resolves;
      expect(mockNotificationsRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});

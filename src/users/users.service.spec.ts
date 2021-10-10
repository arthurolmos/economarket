import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserCreateInput } from './inputs/user-create.input';
import { UserUpdateInput } from './inputs/user-update.input';
import { MockRepository, MockUser } from '../../test/mocks';
import * as faker from 'faker';

describe('UsersService', () => {
  let service: UsersService;
  const mockRepository = new MockRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    let mockUsers: User[];

    beforeEach(() => {
      mockUsers = [];

      for (let i = 0; i < 5; i++) {
        const user = new MockUser();

        mockUsers.push(user);
      }
    });

    it('should find all Users ', async () => {
      mockRepository.find.mockReturnValue(mockUsers);

      const users = await service.findAll();

      expect(users).toBeDefined();
      expect(users).toHaveLength(5);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllById', () => {
    let mockUsers: User[];

    beforeEach(() => {
      mockUsers = [];

      for (let i = 0; i < 5; i++) {
        const user = new MockUser();
        mockUsers.push(user);
      }
    });

    it('should find two Users by passing its IDs', async () => {
      const userIds = [mockUsers[1].id, mockUsers[3].id];
      mockRepository.find.mockReturnValue([mockUsers[1], mockUsers[3]]);

      const users = await service.findAllById(userIds);

      expect(users).toBeDefined();
      expect(users).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllByEmail', () => {
    let mockUsers: User[];

    beforeEach(() => {
      mockUsers = [];

      for (let i = 0; i < 5; i++) {
        const user = new MockUser();
        mockUsers.push(user);
      }
    });

    it('should find two Users by passing its emails', async () => {
      const userEmails = [mockUsers[1].email, mockUsers[3].email];
      mockRepository.find.mockReturnValue([mockUsers[1], mockUsers[3]]);

      const users = await service.findAllByEmail(userEmails);

      expect(users).toBeDefined();
      expect(users).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    let mockUser: User;

    beforeEach(() => {
      mockUser = new MockUser();
    });

    it('should find an User by passing its ID ', async () => {
      const id = mockUser.id;
      mockRepository.findOne.mockReturnValue(mockUser);

      const user = await service.findOne(id);

      expect(user).toBeDefined();
      expect(user).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneByEmail', () => {
    let mockUser: User;

    beforeEach(() => {
      mockUser = new MockUser();
    });

    it('should find an User by passing its Email ', async () => {
      const email = mockUser.email;
      mockRepository.findOne.mockReturnValue(mockUser);

      const user = await service.findOneByEmail(email);

      expect(user).toBeDefined();
      expect(user).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    let mockUser: User;

    it('should create a new User and returns it', async () => {
      const mockData: UserCreateInput = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: '12345678',
      };

      mockUser = new MockUser(
        mockData.firstName,
        mockData.lastName,
        mockData.email,
        mockData.password,
      );

      mockRepository.save.mockReturnValue(mockUser);

      const user = await service.create(mockData);

      expect(user).toBeDefined();
      expect(user).toEqual(mockUser);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    let mockUser: User;

    beforeEach(() => {
      mockUser = new MockUser();
    });

    it('should update firstname and lastname of an User and returns it', async () => {
      const mockValues: UserUpdateInput = {
        firstName: 'A new firstname',
        lastName: 'A new lastname',
      };
      mockUser.firstName = mockValues.firstName;
      mockUser.lastName = mockValues.lastName;
      mockRepository.findOne.mockReturnValue(mockUser);
      const id = mockUser.id;

      const user = await service.update(id, mockValues);

      expect(user).toBeDefined();
      expect(user.firstName).toEqual(mockValues.firstName);
      expect(user.lastName).toEqual(mockValues.lastName);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if User not found', async () => {
      const mockValues: UserUpdateInput = {
        firstName: 'A new firstname',
        lastName: 'A new lastname',
      };
      mockUser.firstName = mockValues.firstName;
      mockUser.lastName = mockValues.lastName;
      mockRepository.findOne.mockReturnValue(null);
      const id = 'invalidId';

      await expect(service.update(id, mockValues)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    let mockUser: User;

    beforeEach(() => {
      mockUser = new MockUser();
    });

    it('should soft delete an User', async () => {
      const id = mockUser.id;
      mockRepository.softDelete.mockReturnValue(Promise.resolve());

      expect(await service.delete(id)).resolves;
      expect(mockRepository.softDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe('restore', () => {
    let mockUser: User;

    beforeEach(() => {
      mockUser = new MockUser();
    });

    it('should restore a soft deleted User', async () => {
      const id = mockUser.id;
      mockRepository.softDelete.mockReturnValue(Promise.resolve());
      mockRepository.restore.mockReturnValue(Promise.resolve());

      expect(await service.delete(id)).resolves;
      expect(await service.restore(id)).resolves;
      expect(mockRepository.softDelete).toHaveBeenCalledTimes(1);
      expect(mockRepository.restore).toHaveBeenCalledTimes(1);
    });
  });
});

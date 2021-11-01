import { Test, TestingModule } from '@nestjs/testing';
import { User } from './user.entity';
import { UsersResolver } from './users.resolver';
import { UserCreateInput } from './inputs/user-create.input';
import { UserUpdateInput } from './inputs/user-update.input';
import { UsersService } from './users.service';
import { MockUser, MockUsersService } from '../../test/mocks';
import * as faker from 'faker';

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  const service = new MockUsersService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: service,
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);

    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    let mockUsers: User[];

    beforeEach(() => {
      mockUsers = [];

      for (let i = 0; i < 5; i++) {
        const user = new MockUser();

        mockUsers.push(user);
      }
    });

    it('should return all Users', async () => {
      service.findAll.mockReturnValue(mockUsers);
      const users = await resolver.getUsers();

      expect(users).toBeDefined();
      expect(users).toHaveLength(5);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUser', () => {
    let mockUser: User;

    beforeEach(() => {
      mockUser = new MockUser();
    });

    it('should return an User by passing its ID', async () => {
      const id = mockUser.id;
      service.findOne.mockReturnValue(mockUser);

      const user = await resolver.getUser(id);

      expect(user).toBeDefined();
      expect(user).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('createUser', () => {
    let mockUser: User;

    it('should create a new User and return it', async () => {
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
      service.create.mockReturnValue(mockUser);

      const user = await resolver.createUser(mockData);

      expect(user).toBeDefined();
      expect(user).toEqual(mockUser);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateUser', () => {
    let mockUser: User;

    beforeEach(() => {
      mockUser = new MockUser();
    });

    it('should update firstname and lastname of an User and return it', async () => {
      const mockValues: UserUpdateInput = {
        firstName: 'A new firstname',
        lastName: 'A new lastname',
      };
      mockUser.firstName = mockValues.firstName;
      mockUser.lastName = mockValues.lastName;
      service.update.mockReturnValue(mockUser);
      const id = mockUser.id;

      const user = await resolver.updateUser(id, mockValues);

      expect(user).toBeDefined();
      expect(user.firstName).toEqual(mockValues.firstName);
      expect(user.lastName).toEqual(mockValues.lastName);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteUser', () => {
    let mockUser: User;

    beforeEach(() => {
      mockUser = new MockUser();
    });

    it('should soft delete an User', async () => {
      const id = mockUser.id;
      service.delete.mockReturnValue(Promise.resolve());

      expect(await resolver.deleteUser(id)).resolves;
      expect(service.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('restoreUser', () => {
    let mockUser: User;

    beforeEach(() => {
      mockUser = new MockUser();
    });

    it('should restore a soft deleted User', async () => {
      const id = mockUser.id;
      service.delete.mockReturnValue(Promise.resolve());
      service.restore.mockReturnValue(Promise.resolve());

      expect(await resolver.deleteUser(id)).resolves;
      expect(await resolver.restoreUser(id)).resolves;
      expect(service.delete).toHaveBeenCalledTimes(1);
      expect(service.restore).toHaveBeenCalledTimes(1);
    });
  });
});

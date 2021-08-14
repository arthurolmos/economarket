import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import * as faker from 'faker';
import { UserCreateInput } from './inputs/user-create.input';
import { UserUpdateInput } from './inputs/user-update.input';
import { ShoppingListsService } from '../shopping-lists/shopping-lists.service';
import { ShoppingList } from '../shopping-lists/shopping-list.entity';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let service: UsersService;
  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
  };
  const mockShoppingListsRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        ShoppingListsService,
        {
          provide: getRepositoryToken(ShoppingList),
          useValue: mockShoppingListsRepository,
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    const mockUsers: User[] = [];

    beforeAll(() => {
      for (let i = 0; i < 5; i++) {
        const user = new User();
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.email = faker.internet.email();

        mockUsers.push(user);
      }
    });

    it('should return all Users', async () => {
      mockRepository.find.mockReturnValue(mockUsers);

      const users = await resolver.getUsers();

      expect(users).toBeDefined();
      expect(users).toHaveLength(5);
    });
  });

  describe('getUsers', () => {
    const mockUser = new User();

    beforeAll(() => {
      mockUser.id = faker.datatype.uuid();
      mockUser.firstName = faker.name.firstName();
      mockUser.lastName = faker.name.lastName();
      mockUser.email = faker.internet.email();
    });

    it('should return an User by passing its ID', async () => {
      const id = mockUser.id;
      mockRepository.findOne.mockReturnValue(mockUser);

      const user = await resolver.getUser(id);

      expect(user).toBeDefined();
      expect(user).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('createUser', () => {
    let mockData: UserCreateInput;

    beforeAll(() => {
      mockData = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: '12345678',
      };
    });

    it('should create a new User and returns it', async () => {
      const mockUser = new User();
      mockUser.firstName = mockData.firstName;
      mockUser.lastName = mockData.lastName;
      mockUser.email = mockData.email;
      mockUser.password = mockData.password;
      mockRepository.save.mockReturnValue(mockUser);

      const user = await resolver.createUser(mockData);

      expect(user).toBeDefined();
      expect(user).toEqual(mockUser);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateUser', () => {
    const mockUser = new User();

    beforeAll(() => {
      mockUser.id = faker.datatype.uuid();
      mockUser.firstName = faker.name.firstName();
      mockUser.lastName = faker.name.lastName();
      mockUser.email = faker.internet.email();
      mockUser.password = '12345678';
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

      const user = await resolver.updateUser(id, mockValues);

      expect(user).toBeDefined();
      expect(user.firstName).toEqual(mockValues.firstName);
      expect(user.lastName).toEqual(mockValues.lastName);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteUser', () => {
    const mockUser = new User();

    beforeAll(() => {
      mockUser.id = faker.datatype.uuid();
      mockUser.firstName = faker.name.firstName();
      mockUser.lastName = faker.name.lastName();
      mockUser.email = faker.internet.email();
    });

    it('should soft delete an User', async () => {
      const id = mockUser.id;
      mockRepository.softDelete.mockReturnValue(Promise.resolve());

      expect(await resolver.deleteUser(id)).resolves;
      expect(mockRepository.softDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe('restoreUser', () => {
    const mockUser = new User();

    beforeAll(() => {
      mockUser.id = faker.datatype.uuid();
      mockUser.firstName = faker.name.firstName();
      mockUser.lastName = faker.name.lastName();
      mockUser.email = faker.internet.email();
    });

    it('should restore a soft deleted User', async () => {
      const id = mockUser.id;
      mockRepository.softDelete.mockReturnValue(Promise.resolve());
      mockRepository.restore.mockReturnValue(Promise.resolve());

      expect(await resolver.deleteUser(id)).resolves;
      expect(await resolver.restoreUser(id)).resolves;
      expect(mockRepository.softDelete).toHaveBeenCalledTimes(1);
      expect(mockRepository.restore).toHaveBeenCalledTimes(1);
    });
  });
});

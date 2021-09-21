import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { ShoppingList } from './shopping-list.entity';
import { ShoppingListsService } from './shopping-lists.service';
import * as faker from 'faker';
import { ShoppingListsCreateInput } from './inputs/shopping-lists-create.input';
import { ShoppingListsUpdateInput } from './inputs/shopping-lists-update.input';
import { ListProductsService } from '../list-products/list-products.service';
import { ListProduct } from '../list-products/list-product.entity';

describe('ShoppingListsService', () => {
  let shoppingListsService: ShoppingListsService;
  let usersService: UsersService;

  const mockShoppingListsRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    restore: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    restore: jest.fn(),
  };

  const mockListProductRepository = {
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
        ShoppingListsService,
        {
          provide: getRepositoryToken(ShoppingList),
          useValue: mockShoppingListsRepository,
        },
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        ListProductsService,
        {
          provide: getRepositoryToken(ListProduct),
          useValue: mockListProductRepository,
        },
      ],
    }).compile();

    shoppingListsService =
      module.get<ShoppingListsService>(ShoppingListsService);
    usersService = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    const mockUsers: User[] = [];
    const mockShoppingLists: ShoppingList[] = [];

    beforeAll(() => {
      for (let i = 0; i < 2; i++) {
        const user = new User();
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.email = faker.internet.email();

        mockUsers.push(user);
      }

      for (let i = 0; i < 5; i++) {
        const shoppingList = new ShoppingList();
        shoppingList.name = faker.name.firstName();
        shoppingList.date = new Date();

        shoppingList.user = i % 2 === 0 ? mockUsers[0] : mockUsers[1];

        mockShoppingLists.push(shoppingList);
      }
    });

    it('should return all Shopping Lists', async () => {
      mockShoppingListsRepository.find.mockReturnValue(mockShoppingLists);

      const shoppingLists = await shoppingListsService.findAll();

      expect(shoppingLists).toBeDefined();
      expect(shoppingLists).toHaveLength(5);
      expect(mockShoppingListsRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllByUser', () => {
    const mockUsers: User[] = [];
    const mockShoppingLists: ShoppingList[] = [];

    beforeAll(() => {
      for (let i = 0; i < 2; i++) {
        const user = new User();
        user.id = 'id' + i;
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.email = faker.internet.email();

        mockUsers.push(user);
      }

      for (let i = 0; i < 5; i++) {
        const shoppingList = new ShoppingList();
        shoppingList.name = faker.name.firstName();
        shoppingList.date = new Date();

        shoppingList.user = i % 2 === 0 ? mockUsers[0] : mockUsers[1];

        mockShoppingLists.push(shoppingList);
      }
    });

    it('should return all Shopping Lists by User', async () => {
      const userId = mockUsers[0].id;
      const filtered = mockShoppingLists.filter(
        (shoppingList) => shoppingList.user.id === userId,
      );
      mockShoppingListsRepository.createQueryBuilder.mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn(() => filtered),
      }));

      const shoppingLists = await shoppingListsService.findAllByUser(userId);

      expect(shoppingLists).toBeDefined();
      expect(shoppingLists).toHaveLength(3);
      expect(
        mockShoppingListsRepository.createQueryBuilder,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    const mockUsers: User[] = [];
    const mockShoppingLists: ShoppingList[] = [];

    beforeAll(() => {
      for (let i = 0; i < 2; i++) {
        const user = new User();
        user.id = 'id' + i;
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.email = faker.internet.email();

        mockUsers.push(user);
      }

      for (let i = 0; i < 5; i++) {
        const shoppingList = new ShoppingList();
        shoppingList.id = i + '';
        shoppingList.name = faker.name.firstName();
        shoppingList.date = new Date();

        shoppingList.user = i % 2 === 0 ? mockUsers[0] : mockUsers[1];

        mockShoppingLists.push(shoppingList);
      }
    });

    it('should return a Shopping Lists by passing its ID', async () => {
      const shoppingListId = mockShoppingLists[0].id;
      mockShoppingListsRepository.findOne.mockReturnValue(mockShoppingLists[0]);

      const shoppingList = await shoppingListsService.findOne(shoppingListId);

      expect(shoppingList).toBeDefined();
      expect(shoppingList).toBe(mockShoppingLists[0]);
      expect(mockShoppingListsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneByUser', () => {
    const mockUsers: User[] = [];
    const mockShoppingLists: ShoppingList[] = [];

    beforeAll(() => {
      for (let i = 0; i < 2; i++) {
        const user = new User();
        user.id = 'id' + i;
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.email = faker.internet.email();

        mockUsers.push(user);
      }

      for (let i = 0; i < 5; i++) {
        const shoppingList = new ShoppingList();
        shoppingList.id = i + '';
        shoppingList.name = faker.name.firstName();
        shoppingList.date = new Date();

        shoppingList.user = i % 2 === 0 ? mockUsers[0] : mockUsers[1];

        mockShoppingLists.push(shoppingList);
      }
    });

    it('should return one Shopping Lists from User by passing Users ID and Shopping List ID', async () => {
      const id = mockShoppingLists[0].id;
      const userId = mockShoppingLists[0].user.id;
      mockShoppingListsRepository.createQueryBuilder.mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn(() => mockShoppingLists[0]),
      }));

      const shoppingList = await shoppingListsService.findOneByUser(id, userId);

      expect(shoppingList).toBeDefined();
      expect(shoppingList).toBe(mockShoppingLists[0]);
      expect(
        mockShoppingListsRepository.createQueryBuilder,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('createShoppingList', () => {
    const mockUser = new User();

    beforeAll(() => {
      mockUser.id = faker.datatype.uuid();
      mockUser.firstName = faker.name.firstName();
      mockUser.lastName = faker.name.lastName();
      mockUser.email = faker.internet.email();
      mockUser.password = '12345678';
    });

    it('should create a new Shopping List and returns it', async () => {
      const mockData: ShoppingListsCreateInput = {
        name: faker.name.firstName(),
        date: new Date(),
      };
      const mockShoppingList = new ShoppingList();
      mockShoppingList.name = mockData.name;
      mockShoppingList.date = mockData.date;
      mockShoppingList.user = mockUser;
      mockShoppingListsRepository.save.mockReturnValue(mockShoppingList);

      const shoppingList = await shoppingListsService.create(
        mockData,
        mockUser,
      );

      expect(shoppingList).toBeDefined();
      expect(shoppingList).toEqual(mockShoppingList);
      expect(mockShoppingListsRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateShoppingList', () => {
    const mockUser = new User();
    const mockShoppingList = new ShoppingList();

    beforeAll(() => {
      mockUser.id = faker.datatype.uuid();
      mockUser.firstName = faker.name.firstName();
      mockUser.lastName = faker.name.lastName();
      mockUser.email = faker.internet.email();
      mockUser.password = '12345678';

      mockShoppingList.id = faker.datatype.uuid();
      mockShoppingList.name = faker.name.firstName();
      mockShoppingList.date = new Date();
      mockShoppingList.done = false;
      mockShoppingList.user = mockUser;
    });

    it('should create a new Shopping List, update and returns it', async () => {
      const mockValues: ShoppingListsUpdateInput = {
        name: faker.name.firstName(),
        date: new Date(),
        done: true,
      };
      mockShoppingList.name = mockValues.name;
      mockShoppingList.date = mockValues.date;
      mockShoppingList.done = mockValues.done;
      mockShoppingListsRepository.findOne.mockReturnValue(mockShoppingList);
      mockShoppingListsRepository.save.mockReturnValue(mockShoppingList);

      const shoppingList = await shoppingListsService.update(
        mockShoppingList.id,
        mockValues,
        mockUser.id,
      );

      expect(shoppingList).toBeDefined();
      expect(shoppingList).toEqual(mockShoppingList);
      expect(mockShoppingListsRepository.save).toHaveBeenCalledTimes(1);
      expect(mockShoppingListsRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should create a new Shopping List, try to update and throw an error for not finding', async () => {
      const mockValues: ShoppingListsUpdateInput = {
        name: faker.name.firstName(),
        date: new Date(),
        done: true,
      };
      mockShoppingList.name = mockValues.name;
      mockShoppingList.date = mockValues.date;
      mockShoppingList.done = mockValues.done;
      mockShoppingListsRepository.findOne.mockReturnValue(null);

      await expect(
        shoppingListsService.update('invalidId', mockValues, mockUser.id),
      ).rejects.toThrow();
      expect(mockShoppingListsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('addSharedUsersToShoppingList', () => {
    const mockUsers: User[] = [];
    const mockShoppingList = new ShoppingList();

    beforeAll(() => {
      for (let i = 0; i < 5; i++) {
        const mockUser = new User();

        mockUser.id = faker.datatype.uuid();
        mockUser.firstName = faker.name.firstName();
        mockUser.lastName = faker.name.lastName();
        mockUser.email = faker.internet.email();
        mockUser.password = '12345678';

        mockUsers.push(mockUser);
      }

      mockShoppingList.id = faker.datatype.uuid();
      mockShoppingList.name = faker.name.firstName();
      mockShoppingList.date = new Date();
      mockShoppingList.done = false;
      mockShoppingList.user = mockUsers[0];
    });

    it('should create a new Shopping List, share it with an user and return it', async () => {
      const user = mockUsers[2];
      mockShoppingList.sharedUsers = [user];
      mockShoppingListsRepository.findOne.mockReturnValue(mockShoppingList);
      mockShoppingListsRepository.save.mockReturnValue(mockShoppingList);

      const shoppingList =
        await shoppingListsService.addSharedUsersToShoppingList(
          mockShoppingList.id,
          user,
        );

      expect(shoppingList).toBeDefined();
      expect(shoppingList.sharedUsers.length).toEqual(1);
      expect(mockShoppingListsRepository.save).toHaveBeenCalledTimes(1);
      expect(mockShoppingListsRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should create a new Shopping List, try to share and throw an error for not finding it', async () => {
      const user = mockUsers[2];
      mockShoppingList.sharedUsers = [user];
      mockShoppingListsRepository.findOne.mockReturnValue(null);

      await expect(
        shoppingListsService.addSharedUsersToShoppingList('invalidId', user),
      ).rejects.toThrow();
      expect(mockShoppingListsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('unshareShoppingList', () => {
    const mockUsers: User[] = [];
    const mockShoppingList = new ShoppingList();

    beforeAll(() => {
      for (let i = 0; i < 5; i++) {
        const mockUser = new User();

        mockUser.id = faker.datatype.uuid();
        mockUser.firstName = faker.name.firstName();
        mockUser.lastName = faker.name.lastName();
        mockUser.email = faker.internet.email();
        mockUser.password = '12345678';

        mockUsers.push(mockUser);
      }

      mockShoppingList.id = faker.datatype.uuid();
      mockShoppingList.name = faker.name.firstName();
      mockShoppingList.date = new Date();
      mockShoppingList.done = false;
      mockShoppingList.user = mockUsers[0];

      const users = [mockUsers[2], mockUsers[3]];
      mockShoppingList.sharedUsers = users;
    });

    it('should create a new Shopping List, share it with 2 users, remove them and returns it', async () => {
      const users = [mockUsers[2], mockUsers[3]];
      mockShoppingList.sharedUsers = [];
      mockShoppingListsRepository.createQueryBuilder.mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn(() => mockShoppingList),
      }));

      mockShoppingListsRepository.save.mockReturnValue(mockShoppingList);

      const shoppingList =
        await shoppingListsService.deleteSharedUsersFromShoppingList(
          mockShoppingList.id,
          mockShoppingList.user.id,
          users,
        );

      expect(shoppingList).toBeDefined();
      expect(shoppingList.sharedUsers.length).toEqual(0);
      expect(mockShoppingListsRepository.save).toHaveBeenCalledTimes(1);
      expect(
        mockShoppingListsRepository.createQueryBuilder,
      ).toHaveBeenCalledTimes(1);
    });

    it('should create a new Shopping List, try to share and throw an error if not find it', async () => {
      const users = [mockUsers[2], mockUsers[3]];
      mockShoppingList.sharedUsers = [];
      mockShoppingListsRepository.createQueryBuilder.mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn(() => null),
      }));

      await expect(
        shoppingListsService.deleteSharedUsersFromShoppingList(
          'invalidId',
          mockShoppingList.user.id,
          users,
        ),
      ).rejects.toThrow();
      expect(
        mockShoppingListsRepository.createQueryBuilder,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteShoppingList', () => {
    const mockUser = new User();
    const mockShoppingList = new ShoppingList();

    beforeAll(() => {
      mockUser.id = faker.datatype.uuid();
      mockUser.firstName = faker.name.firstName();
      mockUser.lastName = faker.name.lastName();
      mockUser.email = faker.internet.email();
      mockUser.password = '12345678';

      mockShoppingList.id = faker.datatype.uuid();
      mockShoppingList.name = faker.name.firstName();
      mockShoppingList.date = new Date();
      mockShoppingList.done = false;
      mockShoppingList.user = mockUser;
    });

    it('should delete a Shopping List', async () => {
      const id = mockShoppingList.id;
      mockShoppingListsRepository.delete.mockReturnValue(Promise.resolve());

      expect(shoppingListsService.delete(id)).resolves;
      expect(mockShoppingListsRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});

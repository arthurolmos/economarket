import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { ShoppingList } from './shopping-list.entity';
import { ShoppingListsResolver } from './shopping-lists.resolver';
import { ShoppingListsService } from './shopping-lists.service';
import { ShoppingListsCreateInput } from './inputs/shopping-lists-create.input';
import { ShoppingListsUpdateInput } from './inputs/shopping-lists-update.input';
import { ListProductsService } from '../list-products/list-products.service';
import { ListProduct } from '../list-products/list-product.entity';
import { MockRepository, MockShoppingList, MockUser } from '../../test/mocks';

import * as faker from 'faker';

describe('ShoppingListsResolver', () => {
  let resolver: ShoppingListsResolver;

  const mockShoppingListsRepository = new MockRepository();
  const mockUserRepository = new MockRepository();
  const mockListProductRepository = new MockRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingListsResolver,
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

    resolver = module.get<ShoppingListsResolver>(ShoppingListsResolver);

    jest.clearAllMocks();
  });

  describe('getShoppingLists', () => {
    const mockShoppingLists: ShoppingList[] = [];

    beforeEach(() => {
      for (let i = 0; i < 5; i++) {
        const shoppingList = new MockShoppingList();
        mockShoppingLists.push(shoppingList);
      }
    });

    it('should return all Shopping Lists', async () => {
      mockShoppingListsRepository.find.mockReturnValue(mockShoppingLists);

      const shoppingLists = await resolver.getShoppingLists();

      expect(shoppingLists).toBeDefined();
      expect(shoppingLists).toHaveLength(5);
      expect(mockShoppingListsRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getShoppingListsByUser', () => {
    let mockUser: User;
    const mockShoppingLists: ShoppingList[] = [];

    beforeEach(() => {
      mockUser = new MockUser();

      for (let i = 0; i < 5; i++) {
        const shoppingList = new MockShoppingList(mockUser);
        mockShoppingLists.push(shoppingList);
      }
    });

    it('should return all Shopping Lists by User', async () => {
      const userId = mockUser.id;

      mockShoppingListsRepository.createQueryBuilder.mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn(() => mockShoppingLists),
      }));

      const shoppingLists = await resolver.getShoppingListsByUser(userId);

      expect(shoppingLists).toBeDefined();
      expect(shoppingLists).toHaveLength(5);
      expect(
        mockShoppingListsRepository.createQueryBuilder,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('getShoppingList', () => {
    let mockShoppingList: ShoppingList;

    beforeEach(() => {
      mockShoppingList = new MockShoppingList();
    });

    it('should return a Shopping List by passing its ID', async () => {
      const shoppingListId = mockShoppingList.id;
      mockShoppingListsRepository.findOne.mockReturnValue(mockShoppingList);

      const shoppingList = await resolver.getShoppingList(shoppingListId);

      expect(shoppingList).toBeDefined();
      expect(shoppingList).toBe(mockShoppingList);
      expect(mockShoppingListsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('getShoppingListByUser', () => {
    let mockUser: User;
    let mockShoppingList: ShoppingList;

    beforeEach(() => {
      mockUser = new MockUser();
      mockShoppingList = new MockShoppingList(mockUser);
    });

    it('should return one Shopping Lists by User by passing its Ids', async () => {
      const userId = mockUser.id;
      const id = mockShoppingList.id;
      mockShoppingListsRepository.findOne.mockReturnValue(mockShoppingList);

      const shoppingList = await resolver.getShoppingListByUser(id, userId);

      expect(shoppingList).toBeDefined();
      expect(mockShoppingListsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('createShoppingList', () => {
    let mockUser: User;
    let mockShoppingList: ShoppingList;

    beforeEach(() => {
      mockUser = new User();
    });

    it('should create a new Shopping List and returns it', async () => {
      const mockData: ShoppingListsCreateInput = {
        name: faker.name.firstName(),
        date: new Date(),
      };
      mockShoppingList = new MockShoppingList(mockUser, mockData.name, false);
      mockShoppingListsRepository.save.mockReturnValue(mockShoppingList);
      mockUserRepository.findOne.mockReturnValue(mockUser);

      const shoppingList = await resolver.createShoppingList(
        mockData,
        mockUser.id,
      );

      expect(shoppingList).toBeDefined();
      expect(shoppingList).toEqual(mockShoppingList);
      expect(mockShoppingListsRepository.save).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateShoppingList', () => {
    let mockUser: User;
    let mockShoppingList: ShoppingList;

    beforeEach(() => {
      mockUser = new User();
      mockShoppingList = new MockShoppingList(mockUser);
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

      const shoppingList = await resolver.updateShoppingList(
        mockShoppingList.id,
        mockValues,
        mockUser.id,
      );

      expect(shoppingList).toBeDefined();
      expect(shoppingList).toEqual(mockShoppingList);
      expect(mockShoppingListsRepository.save).toHaveBeenCalledTimes(1);
      expect(mockShoppingListsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('finishShoppingList', () => {
    let mockUser: User;
    let mockShoppingList: ShoppingList;

    beforeEach(() => {
      mockUser = new User();
      mockShoppingList = new MockShoppingList(mockUser);
    });

    it('should create a new Shopping List, update done from false to true, and return it', async () => {
      const finishedShoppingList = mockShoppingList;
      finishedShoppingList.done = true;
      mockShoppingListsRepository.findOne.mockReturnValue(mockShoppingList);
      mockShoppingListsRepository.save.mockReturnValue(finishedShoppingList);

      const shoppingList = await resolver.finishShoppingList(
        mockShoppingList.id,
        mockUser.id,
      );

      expect(shoppingList).toBeDefined();
      expect(shoppingList.done).toEqual(true);
      expect(mockShoppingListsRepository.save).toHaveBeenCalledTimes(1);
      expect(mockShoppingListsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('shareShoppingList', () => {
    const mockUsers: User[] = [];
    let mockShoppingList: ShoppingList;

    beforeEach(() => {
      for (let i = 0; i < 5; i++) {
        const mockUser = new MockUser();
        mockUsers.push(mockUser);
      }
      mockShoppingList = new MockShoppingList(mockUsers[0]);
    });

    it('should create a new Shopping List share it with an user and return it', async () => {
      const user = mockUsers[1];
      const userId = user.id;
      mockShoppingList.sharedUsers = [user];
      mockUserRepository.findOne.mockReturnValue(userId);
      mockShoppingListsRepository.findOne.mockReturnValue(mockShoppingList);
      mockShoppingListsRepository.save.mockReturnValue(mockShoppingList);

      const shoppingList = await resolver.shareShoppingList(
        mockShoppingList.id,
        userId,
      );

      expect(shoppingList).toBeDefined();
      expect(shoppingList.sharedUsers.length).toEqual(2);
      expect(mockShoppingListsRepository.save).toHaveBeenCalledTimes(1);
      expect(mockShoppingListsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('unshareShoppingList', () => {
    const mockUsers: User[] = [];
    let mockShoppingList: ShoppingList;

    beforeEach(() => {
      for (let i = 0; i < 5; i++) {
        const mockUser = new MockUser();
        mockUsers.push(mockUser);
      }
      mockShoppingList = new MockShoppingList(mockUsers[0]);
    });

    it('should create a new Shopping List with 2 shared users, remove one of them and return it', async () => {
      const users = [mockUsers[2], mockUsers[3]];
      mockShoppingList.sharedUsers = users;

      const user = mockUsers[2];
      const userId = user.id;
      mockUserRepository.findOne.mockReturnValue(user);
      mockShoppingListsRepository.findOne.mockReturnValue(mockShoppingList);
      mockShoppingListsRepository.save.mockReturnValue(mockShoppingList);

      const shoppingList = await resolver.unshareShoppingList(
        mockShoppingList.id,
        userId,
      );

      expect(shoppingList).toBeDefined();
      expect(shoppingList.sharedUsers.length).toEqual(1);
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockShoppingListsRepository.save).toHaveBeenCalledTimes(1);
      expect(mockShoppingListsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteShoppingList', () => {
    let mockUser: User;
    let mockShoppingList: ShoppingList;

    beforeEach(() => {
      mockUser = new User();
      mockShoppingList = new MockShoppingList(mockUser);
    });

    it('should delete a Shopping List', async () => {
      const id = mockShoppingList.id;
      const userId = mockUser.id;
      mockShoppingListsRepository.createQueryBuilder.mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn(() => mockShoppingList),
      }));
      mockShoppingListsRepository.delete.mockReturnValue(Promise.resolve());

      expect(await resolver.deleteShoppingList(id, userId)).resolves;
      expect(
        mockShoppingListsRepository.createQueryBuilder,
      ).toHaveBeenCalledTimes(1);
      expect(mockShoppingListsRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should not delete a Shopping List if user not found', async () => {
      const id = mockShoppingList.id;
      const userId = 'another user id';
      mockShoppingListsRepository.createQueryBuilder.mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn(() => null),
      }));

      try {
        await resolver.deleteShoppingList(id, userId);
      } catch (err) {
        expect(err).toMatch('error');
      }
      expect(
        mockShoppingListsRepository.createQueryBuilder,
      ).toHaveBeenCalledTimes(1);
      expect(mockShoppingListsRepository.delete).toHaveBeenCalledTimes(0);
    });
  });

  describe('leaveSharedShoppingList', () => {
    const mockUsers: User[] = [];
    let mockShoppingList: ShoppingList;

    beforeEach(() => {
      for (let i = 0; i < 5; i++) {
        const mockUser = new MockUser();
        mockUsers.push(mockUser);
      }
      mockShoppingList = new MockShoppingList(mockUsers[0]);
    });

    it('should create a new Shopping List with 2 shared users, remove the user, and return it', async () => {
      mockShoppingList.sharedUsers = [mockUsers[2], mockUsers[3]];

      const user = mockUsers[2];
      const userId = user.id;
      mockUserRepository.findOne.mockReturnValue(user);
      mockShoppingListsRepository.findOne.mockReturnValue(mockShoppingList);
      mockShoppingListsRepository.save.mockReturnValue(mockShoppingList);

      const shoppingList = await resolver.leaveSharedShoppingList(
        mockShoppingList.id,
        userId,
      );

      expect(shoppingList).toBeDefined();
      expect(shoppingList.sharedUsers.length).toEqual(1);
      expect(mockShoppingListsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockShoppingListsRepository.save).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});

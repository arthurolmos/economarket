import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { ShoppingList } from './shopping-list.entity';
import { ShoppingListsService } from './shopping-lists.service';
import { ShoppingListsCreateInput } from './inputs/shopping-lists-create.input';
import { ShoppingListsUpdateInput } from './inputs/shopping-lists-update.input';
import { ListProductsService } from '../list-products/list-products.service';
import { ListProduct } from '../list-products/list-product.entity';
import {
  MockRepository,
  MockShoppingList,
  MockUser,
  MockListProduct,
  MockConnection,
} from '../../test/mocks';
import * as faker from 'faker';
import { Connection } from 'typeorm';

describe('ShoppingListsService', () => {
  let shoppingListsService: ShoppingListsService;

  const mockShoppingListsRepository = new MockRepository();
  const mockUsersRepository = new MockRepository();
  const mockListProductsRepository = new MockRepository();
  const mockConnection = new MockConnection<ShoppingList>();

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
          useValue: mockUsersRepository,
        },
        ListProductsService,
        {
          provide: getRepositoryToken(ListProduct),
          useValue: mockListProductsRepository,
        },
        {
          provide: Connection,
          useValue: mockConnection,
        },
      ],
    }).compile();

    shoppingListsService =
      module.get<ShoppingListsService>(ShoppingListsService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    let mockShoppingLists: ShoppingList[];

    beforeEach(() => {
      mockShoppingLists = [];

      for (let i = 0; i < 5; i++) {
        const shoppingList = new MockShoppingList();
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
    let mockUser: User;
    let mockShoppingLists: ShoppingList[];

    beforeEach(() => {
      mockUser = new User();
      mockShoppingLists = [];

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
        andWhere: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn(() => mockShoppingLists),
      }));

      const shoppingLists = await shoppingListsService.findAllByUser(userId);

      expect(shoppingLists).toBeDefined();
      expect(shoppingLists).toHaveLength(5);
      expect(
        mockShoppingListsRepository.createQueryBuilder,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    let mockShoppingLists: ShoppingList[];

    beforeEach(() => {
      mockShoppingLists = [];

      for (let i = 0; i < 5; i++) {
        const shoppingList = new MockShoppingList();
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
    let mockUser: User;
    let mockShoppingLists: ShoppingList[];

    beforeEach(() => {
      mockUser = new MockUser();
      mockShoppingLists = [];

      for (let i = 0; i < 5; i++) {
        const shoppingList = new MockShoppingList(mockUser);
        mockShoppingLists.push(shoppingList);
      }
    });

    it('should return one Shopping Lists from User by passing Users ID and Shopping List ID', async () => {
      const id = mockShoppingLists[0].id;
      const userId = mockUser.id;
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
    let mockUser: User;
    let mockShoppingList: ShoppingList;

    beforeEach(() => {
      mockUser = new MockUser();
    });

    it('should create a new Shopping List and returns it', async () => {
      const mockData: ShoppingListsCreateInput = {
        name: faker.name.firstName(),
        date: new Date(),
      };
      mockShoppingList = new MockShoppingList(mockUser, mockData.name);
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
    let mockUser: User;
    let mockShoppingList: ShoppingList;

    beforeEach(() => {
      mockUser = new MockUser();
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
    let mockUsers: User[];
    let mockShoppingList: ShoppingList;

    beforeEach(() => {
      mockUsers = [];

      for (let i = 0; i < 5; i++) {
        const mockUser = new MockUser();
        mockUsers.push(mockUser);
      }

      mockShoppingList = new MockShoppingList(mockUsers[0]);
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
    let mockUsers: User[];
    let mockShoppingList: ShoppingList;

    beforeEach(() => {
      mockUsers = [];

      for (let i = 0; i < 5; i++) {
        const mockUser = new MockUser();
        mockUsers.push(mockUser);
      }

      mockShoppingList = new MockShoppingList(mockUsers[0]);
    });

    it('should create a new Shopping List, share it with 2 users, remove one of them and return it', async () => {
      mockShoppingList.sharedUsers = [mockUsers[2], mockUsers[3]];
      const user = mockUsers[2];
      mockShoppingListsRepository.findOne.mockReturnValue(mockShoppingList);
      mockShoppingListsRepository.save.mockReturnValue(mockShoppingList);

      const shoppingList =
        await shoppingListsService.deleteSharedUserFromShoppingList(
          mockShoppingList.id,
          user,
        );

      expect(shoppingList).toBeDefined();
      expect(shoppingList.sharedUsers.length).toEqual(1);
      expect(mockShoppingListsRepository.save).toHaveBeenCalledTimes(1);
      expect(mockShoppingListsRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should create a new Shopping List, try to share and throw an error if not find it', async () => {
      const user = mockUsers[2];
      mockShoppingList.sharedUsers = [mockUsers[3]];
      mockShoppingListsRepository.findOne.mockReturnValue(null);

      await expect(
        shoppingListsService.deleteSharedUserFromShoppingList(
          'invalidId',
          user,
        ),
      ).rejects.toThrow();
      expect(mockShoppingListsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteShoppingList', () => {
    let mockUser: User;
    let mockShoppingList: ShoppingList;

    beforeEach(() => {
      mockUser = new MockUser();
      mockShoppingList = new MockShoppingList(mockUser);
    });

    it('should delete a Shopping List', async () => {
      const id = mockShoppingList.id;
      mockShoppingListsRepository.delete.mockReturnValue(Promise.resolve());

      expect(shoppingListsService.delete(id)).resolves;
      expect(mockShoppingListsRepository.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('createShoppingListFromPendingProducts', () => {
    let mockUser: User;
    let mockShoppingLists: ShoppingList[];
    let mockListProducts: ListProduct[];

    beforeEach(() => {
      mockUser = new MockUser();
      mockShoppingLists = [];
      mockListProducts = [];

      for (let i = 0; i < 2; i++) {
        const mockShoppingList = new MockShoppingList(mockUser);
        mockShoppingLists.push(mockShoppingList);
      }

      for (let i = 0; i < 6; i++) {
        const mockListProduct = new MockListProduct(
          i < 3 ? mockShoppingLists[0] : mockShoppingLists[1],
        );
        mockListProduct.purchased = i % 2 === 0;
        mockListProducts.push(mockListProduct);
      }
    });

    it('should create a new Shopping List containing the three peding items from other 2 lists', async () => {
      const ids = mockShoppingLists.map((item) => item.id);
      const userId = mockUser.id;
      const listProductsPending = mockListProducts.filter(
        (item) => !item.purchased,
      );
      const mockShoppingList = new MockShoppingList(mockUser);
      mockShoppingList.listProducts = listProductsPending;
      const manager = new MockRepository();
      manager.findOne.mockReturnValue(mockUser);
      manager.find.mockReturnValue(listProductsPending);
      manager.save.mockReturnValue(mockShoppingList);
      mockConnection.transaction.mockImplementation(async (cb) => {
        const shoppingList = await cb(manager);

        return shoppingList;
      });

      const shoppingList =
        await shoppingListsService.createShoppingListFromPendingProducts(
          ids,
          userId,
          false,
        );

      expect(shoppingList).toBeDefined();
      expect(shoppingList.listProducts).toHaveLength(3);
      expect(manager.findOne).toHaveBeenCalledTimes(1);
      expect(manager.find).toHaveBeenCalledTimes(1);
      expect(manager.save).toHaveBeenCalledTimes(1);
      expect(manager.remove).toHaveBeenCalledTimes(0);
    });

    it('should create a new Shopping List containing the three peding items from other 2 lists, and remove them from the original lists', async () => {
      const ids = mockShoppingLists.map((item) => item.id);
      const userId = mockUser.id;
      const listProductsPending = mockListProducts.filter(
        (item) => !item.purchased,
      );
      const mockShoppingList = new MockShoppingList(mockUser);
      mockShoppingList.listProducts = listProductsPending;
      const manager = new MockRepository();
      manager.findOne.mockReturnValue(mockUser);
      manager.find.mockReturnValue(listProductsPending);
      manager.save.mockReturnValue(mockShoppingList);
      manager.remove.mockReturnValue(Promise.resolve);
      mockConnection.transaction.mockImplementation(async (cb) => {
        const shoppingList = await cb(manager);

        return shoppingList;
      });

      const shoppingList =
        await shoppingListsService.createShoppingListFromPendingProducts(
          ids,
          userId,
          true,
        );

      expect(shoppingList).toBeDefined();
      expect(shoppingList.listProducts).toHaveLength(3);
      expect(manager.findOne).toHaveBeenCalledTimes(1);
      expect(manager.find).toHaveBeenCalledTimes(1);
      expect(manager.save).toHaveBeenCalledTimes(1);
      expect(manager.remove).toHaveBeenCalledTimes(1);
    });
  });

  describe('createShoppingListFromShoppingLists', () => {
    let mockUser: User;
    let mockShoppingLists: ShoppingList[];
    let mockListProducts: ListProduct[];

    beforeEach(() => {
      mockUser = new MockUser();
      mockShoppingLists = [];
      mockListProducts = [];

      for (let i = 0; i < 2; i++) {
        const mockShoppingList = new MockShoppingList(mockUser);
        mockShoppingList.listProducts = [];
        mockShoppingLists.push(mockShoppingList);
      }

      for (let i = 0; i < 6; i++) {
        const mockListProduct = new MockListProduct(
          i < 3 ? mockShoppingLists[0] : mockShoppingLists[1],
        );
        mockListProducts.push(mockListProduct);
      }
    });

    it('should create a new Shopping List containing all items from other 2 lists', async () => {
      const ids = mockShoppingLists.map((item) => item.id);
      const userId = mockUser.id;
      const mockShoppingList = new MockShoppingList(mockUser);
      mockShoppingList.listProducts = mockListProducts;
      const manager = new MockRepository();
      manager.findOne.mockReturnValue(mockUser);
      manager.find.mockReturnValue(mockListProducts);
      manager.save.mockReturnValue(mockShoppingList);
      mockConnection.transaction.mockImplementation(async (cb) => {
        const shoppingList = await cb(manager);

        return shoppingList;
      });

      const shoppingList =
        await shoppingListsService.createShoppingListFromShoppingLists(
          ids,
          userId,
        );

      expect(shoppingList).toBeDefined();
      expect(shoppingList.listProducts).toHaveLength(6);
      expect(manager.findOne).toHaveBeenCalledTimes(1);
      expect(manager.find).toHaveBeenCalledTimes(1);
      expect(manager.save).toHaveBeenCalledTimes(1);
      expect(manager.remove).toHaveBeenCalledTimes(0);
    });

    it('should create a new Shopping List containing the 6 items, and the repeated items are agglutinated in one', async () => {
      const ids = mockShoppingLists.map((item) => item.id);
      const userId = mockUser.id;
      const productRepeatedA = mockListProducts[3];
      const productRepeatedB = mockListProducts[0];
      const mockShoppingList = new MockShoppingList(mockUser);
      mockShoppingList.listProducts = mockListProducts;
      mockShoppingLists[0].listProducts.push(productRepeatedA); //Item 3 added to shopping list 0
      mockShoppingLists[1].listProducts.push(productRepeatedB); //Item 0 added to shopping list 1
      mockShoppingList.listProducts[0].quantity += productRepeatedA.quantity;
      mockShoppingList.listProducts[3].quantity += productRepeatedB.quantity;

      const manager = new MockRepository();
      manager.findOne.mockReturnValue(mockUser);
      manager.find.mockReturnValue(mockListProducts);
      manager.save.mockReturnValue(mockShoppingList);
      manager.remove.mockReturnValue(Promise.resolve);
      mockConnection.transaction.mockImplementation(async (cb) => {
        const shoppingList = await cb(manager);

        return shoppingList;
      });

      const shoppingList =
        await shoppingListsService.createShoppingListFromShoppingLists(
          ids,
          userId,
        );

      expect(shoppingList).toBeDefined();
      expect(shoppingList.listProducts).toHaveLength(6);
      expect(manager.findOne).toHaveBeenCalledTimes(1);
      expect(manager.find).toHaveBeenCalledTimes(1);
      expect(manager.save).toHaveBeenCalledTimes(1);
    });
  });
});

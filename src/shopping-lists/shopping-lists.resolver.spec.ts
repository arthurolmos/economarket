import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/user.entity';
import { ShoppingList } from './shopping-list.entity';
import { ShoppingListsResolver } from './shopping-lists.resolver';
import { ShoppingListsService } from './shopping-lists.service';
import { ShoppingListsCreateInput } from './inputs/shopping-lists-create.input';
import { ShoppingListsUpdateInput } from './inputs/shopping-lists-update.input';
import { ListProduct } from '../list-products/list-product.entity';
import {
  MockShoppingList,
  MockUser,
  MockListProduct,
  MockShoppingListsService,
} from '../../test/mocks';
import * as faker from 'faker';

describe('ShoppingListsResolver', () => {
  let resolver: ShoppingListsResolver;

  const service = new MockShoppingListsService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingListsResolver,
        {
          provide: ShoppingListsService,
          useValue: service,
        },
      ],
    }).compile();

    resolver = module.get<ShoppingListsResolver>(ShoppingListsResolver);

    jest.clearAllMocks();
  });

  describe('getShoppingLists', () => {
    let mockShoppingLists: ShoppingList[];

    beforeEach(() => {
      mockShoppingLists = [];

      for (let i = 0; i < 5; i++) {
        const shoppingList = new MockShoppingList();
        mockShoppingLists.push(shoppingList);
      }
    });

    it('should return all Shopping Lists', async () => {
      service.findAll.mockReturnValue(mockShoppingLists);

      const shoppingLists = await resolver.getShoppingLists();

      expect(shoppingLists).toBeDefined();
      expect(shoppingLists).toHaveLength(5);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getShoppingListsByUser', () => {
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

    it('should return all Shopping Lists by User', async () => {
      const userId = mockUser.id;
      service.findAllByUser.mockReturnValue(mockShoppingLists);

      const shoppingLists = await resolver.getShoppingListsByUser(userId);

      expect(shoppingLists).toBeDefined();
      expect(shoppingLists).toHaveLength(5);
      expect(service.findAllByUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('getShoppingList', () => {
    let mockShoppingList: ShoppingList;

    beforeEach(() => {
      mockShoppingList = new MockShoppingList();
    });

    it('should return a Shopping List by passing its ID', async () => {
      const shoppingListId = mockShoppingList.id;
      service.findOne.mockReturnValue(mockShoppingList);

      const shoppingList = await resolver.getShoppingList(shoppingListId);

      expect(shoppingList).toBeDefined();
      expect(shoppingList).toBe(mockShoppingList);
      expect(service.findOne).toHaveBeenCalledTimes(1);
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
      service.findOneByUser.mockReturnValue(mockShoppingList);

      const shoppingList = await resolver.getShoppingListByUser(id, userId);

      expect(shoppingList).toBeDefined();
      expect(service.findOneByUser).toHaveBeenCalledTimes(1);
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
      service.create.mockReturnValue(mockShoppingList);

      const shoppingList = await resolver.createShoppingList(
        mockData,
        mockUser.id,
      );

      expect(shoppingList).toBeDefined();
      expect(shoppingList).toEqual(mockShoppingList);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateShoppingList', () => {
    let mockShoppingList: ShoppingList;

    beforeEach(() => {
      mockShoppingList = new MockShoppingList();
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
      service.update.mockReturnValue(mockShoppingList);

      const shoppingList = await resolver.updateShoppingList(
        mockShoppingList.id,
        mockValues,
      );

      expect(shoppingList).toBeDefined();
      expect(shoppingList).toEqual(mockShoppingList);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('finishShoppingList', () => {
    let mockShoppingList: ShoppingList;

    beforeEach(() => {
      mockShoppingList = new MockShoppingList();
    });

    it('should create a new Shopping List, update done from false to true, and return it', async () => {
      const finishedShoppingList = mockShoppingList;
      finishedShoppingList.done = true;
      service.update.mockReturnValue(finishedShoppingList);

      const shoppingList = await resolver.finishShoppingList(
        mockShoppingList.id,
      );

      expect(shoppingList).toBeDefined();
      expect(shoppingList.done).toEqual(true);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('restoreShoppingList', () => {
    let mockShoppingList: ShoppingList;

    beforeEach(() => {
      mockShoppingList = new MockShoppingList();
      mockShoppingList.done = true;
    });

    it('should create a finished Shopping List, update done from true to false, and return it', async () => {
      const finishedShoppingList = mockShoppingList;
      finishedShoppingList.done = false;
      service.update.mockReturnValue(finishedShoppingList);

      const shoppingList = await resolver.restoreShoppingList(
        mockShoppingList.id,
      );

      expect(shoppingList).toBeDefined();
      expect(shoppingList.done).toEqual(false);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('shareShoppingList', () => {
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

    it('should create a new Shopping List share it with an user and return it', async () => {
      const user = mockUsers[1];
      const userId = user.id;
      mockShoppingList.sharedUsers = [user];
      service.addSharedUsersToShoppingList.mockReturnValue(mockShoppingList);

      const shoppingList = await resolver.shareShoppingList(
        mockShoppingList.id,
        userId,
      );

      expect(shoppingList).toBeDefined();
      expect(shoppingList.sharedUsers.length).toEqual(1);
      expect(service.addSharedUsersToShoppingList).toHaveBeenCalledTimes(1);
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

    it('should create a new Shopping List with 2 shared users, remove one of them and return it', async () => {
      const users = [mockUsers[2], mockUsers[3]];
      mockShoppingList.sharedUsers = users;

      const user = mockUsers[2];
      const userId = user.id;
      service.deleteSharedUserFromShoppingList.mockImplementationOnce(() => {
        mockShoppingList.sharedUsers.shift();

        return mockShoppingList;
      });

      const shoppingList = await resolver.unshareShoppingList(
        mockShoppingList.id,
        userId,
      );

      expect(shoppingList).toBeDefined();
      expect(shoppingList.sharedUsers.length).toEqual(1);
      expect(service.deleteSharedUserFromShoppingList).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteShoppingList', () => {
    let mockShoppingList: ShoppingList;

    beforeEach(() => {
      mockShoppingList = new MockShoppingList();
    });

    it('should delete a Shopping List', async () => {
      const id = mockShoppingList.id;
      service.delete.mockReturnValue(Promise.resolve());

      expect(await resolver.deleteShoppingList(id)).resolves;
      expect(service.delete).toHaveBeenCalledTimes(1);
    });

    it('should not delete a Shopping List if user not found', async () => {
      const id = mockShoppingList.id;

      try {
        await resolver.deleteShoppingList(id);
      } catch (err) {
        expect(err).toMatch('error');
      }
      expect(service.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('leaveSharedShoppingList', () => {
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

    it('should create a new Shopping List with 2 shared users, remove the user, and return it', async () => {
      mockShoppingList.sharedUsers = [mockUsers[2], mockUsers[3]];

      const user = mockShoppingList.sharedUsers[0];
      const userId = user.id;
      service.deleteSharedUserFromShoppingList.mockImplementationOnce(() => {
        mockShoppingList.sharedUsers.shift();

        return mockShoppingList;
      });

      const shoppingList = await resolver.leaveSharedShoppingList(
        mockShoppingList.id,
        userId,
      );

      expect(shoppingList).toBeDefined();
      expect(shoppingList.sharedUsers.length).toEqual(1);
      expect(service.deleteSharedUserFromShoppingList).toHaveBeenCalledTimes(1);
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

    it('should create a new Shopping List containing the three peding itens from other 2 lists', async () => {
      const ids = mockShoppingLists.map((item) => item.id);
      const userId = mockUser.id;
      const mockData: ShoppingListsCreateInput = {
        name: faker.name.firstName(),
        date: new Date(),
      };
      const listProductsPending = mockListProducts.filter(
        (item) => !item.purchased,
      );
      const mockShoppingList = new MockShoppingList(mockUser);
      mockShoppingList.listProducts = listProductsPending;
      service.createShoppingListFromPendingProducts.mockReturnValue(
        mockShoppingList,
      );

      const shoppingList = await resolver.createShoppingListFromPendingProducts(
        ids,
        userId,
        false,
        mockData,
      );

      expect(shoppingList).toBeDefined();
      expect(shoppingList.listProducts).toHaveLength(3);
      expect(
        service.createShoppingListFromPendingProducts,
      ).toHaveBeenCalledTimes(1);
    });

    it('should create a new Shopping List containing the three peding itens from other 2 lists, and remove them from the original lists', async () => {
      const ids = mockShoppingLists.map((item) => item.id);
      const userId = mockUser.id;
      const mockData: ShoppingListsCreateInput = {
        name: faker.name.firstName(),
        date: new Date(),
      };
      const listProductsPending = mockListProducts.filter(
        (item) => !item.purchased,
      );
      const mockShoppingList = new MockShoppingList(mockUser);
      mockShoppingList.listProducts = listProductsPending;
      service.createShoppingListFromPendingProducts.mockReturnValue(
        mockShoppingList,
      );

      const shoppingList = await resolver.createShoppingListFromPendingProducts(
        ids,
        userId,
        true,
        mockData,
      );

      expect(shoppingList).toBeDefined();
      expect(shoppingList.listProducts).toHaveLength(3);
      expect(
        service.createShoppingListFromPendingProducts,
      ).toHaveBeenCalledTimes(1);
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
      const mockData: ShoppingListsCreateInput = {
        name: faker.name.firstName(),
        date: new Date(),
      };
      const mockShoppingList = new MockShoppingList(mockUser);
      mockShoppingList.listProducts = mockListProducts;
      service.createShoppingListFromShoppingLists.mockReturnValue(
        mockShoppingList,
      );

      const shoppingList = await resolver.createShoppingListFromShoppingLists(
        ids,
        userId,
        mockData,
      );

      expect(shoppingList).toBeDefined();
      expect(shoppingList.listProducts).toHaveLength(6);
      expect(service.createShoppingListFromShoppingLists).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should create a new Shopping List containing the 6 items, and the repeated items are agglutinated in one', async () => {
      const ids = mockShoppingLists.map((item) => item.id);
      const userId = mockUser.id;
      const mockData: ShoppingListsCreateInput = {
        name: faker.name.firstName(),
        date: new Date(),
      };
      const productRepeatedA = mockListProducts[3];
      const productRepeatedB = mockListProducts[0];
      const mockShoppingList = new MockShoppingList(mockUser);
      mockShoppingList.listProducts = mockListProducts;
      mockShoppingLists[0].listProducts.push(productRepeatedA); //Item 3 added to shopping list 0
      mockShoppingLists[1].listProducts.push(productRepeatedB); //Item 0 added to shopping list 1
      mockShoppingList.listProducts[0].quantity += productRepeatedA.quantity;
      mockShoppingList.listProducts[3].quantity += productRepeatedB.quantity;
      service.createShoppingListFromShoppingLists.mockReturnValue(
        mockShoppingList,
      );

      const shoppingList = await resolver.createShoppingListFromShoppingLists(
        ids,
        userId,
        mockData,
      );

      expect(shoppingList).toBeDefined();
      expect(shoppingList.listProducts).toHaveLength(6);
      expect(service.createShoppingListFromShoppingLists).toHaveBeenCalledTimes(
        1,
      );
    });
  });
});

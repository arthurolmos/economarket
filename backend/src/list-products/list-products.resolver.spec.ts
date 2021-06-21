import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShoppingList } from '../shopping-lists/shopping-list.entity';
import { User } from '../users/user.entity';
import { ShoppingListsService } from '../shopping-lists/shopping-lists.service';
import { ListProduct } from './list-product.entity';
import { ListProductsResolver } from './list-products.resolver';
import { ListProductsService } from './list-products.service';
import * as faker from 'faker';
import { ListProductsCreateInput } from './inputs/list-products-create.input';
import { ListProductsUpdateInput } from './inputs/list-products-update.input';

describe('ListProductsResolver', () => {
  let resolver: ListProductsResolver;

  const mockListProductsRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    restore: jest.fn(),
  };
  const mockShoppingListsRepository = {
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
        ListProductsResolver,
        ListProductsService,
        {
          provide: getRepositoryToken(ListProduct),
          useValue: mockListProductsRepository,
        },
        ShoppingListsService,
        {
          provide: getRepositoryToken(ShoppingList),
          useValue: mockShoppingListsRepository,
        },
      ],
    }).compile();

    resolver = module.get<ListProductsResolver>(ListProductsResolver);

    jest.clearAllMocks();
  });

  describe('getListProducts', () => {
    const mockUsers: User[] = [];
    const mockShoppingLists: ShoppingList[] = [];
    const mockListProducts: ListProduct[] = [];

    beforeAll(() => {
      for (let i = 0; i < 2; i++) {
        const user = new User();
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.email = faker.internet.email();

        mockUsers.push(user);
      }

      for (let i = 0; i < 6; i++) {
        const shoppingList = new ShoppingList();
        shoppingList.name = faker.name.firstName();
        shoppingList.date = new Date();

        shoppingList.user = i % 2 === 0 ? mockUsers[0] : mockUsers[1];

        mockShoppingLists.push(shoppingList);
      }

      for (let i = 0; i < 12; i++) {
        const listProduct = new ListProduct();
        listProduct.id = faker.datatype.uuid();
        listProduct.name = faker.commerce.productName();
        listProduct.price = parseFloat(faker.commerce.price());
        listProduct.quantity = faker.datatype.number();
        listProduct.purchased = i % 2 === 0 ? true : false;
        listProduct.shoppingList =
          i > 5 ? mockShoppingLists[i - 6] : mockShoppingLists[i];

        mockListProducts.push(listProduct);
      }
    });

    it('should return all List Produts', async () => {
      mockListProductsRepository.find.mockReturnValue(mockListProducts);

      const listProducts = await resolver.getListProducts();

      expect(listProducts).toBeDefined();
      expect(listProducts).toHaveLength(12);
      expect(mockListProductsRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getListProductsByShoppingList', () => {
    const mockUsers: User[] = [];
    const mockShoppingLists: ShoppingList[] = [];
    const mockListProducts: ListProduct[] = [];

    beforeAll(() => {
      for (let i = 0; i < 2; i++) {
        const user = new User();
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.email = faker.internet.email();

        mockUsers.push(user);
      }

      for (let i = 0; i < 6; i++) {
        const shoppingList = new ShoppingList();
        shoppingList.id = i.toString();
        shoppingList.name = faker.name.firstName();
        shoppingList.date = new Date();

        shoppingList.user = i % 2 === 0 ? mockUsers[0] : mockUsers[1];

        mockShoppingLists.push(shoppingList);
      }

      for (let i = 0; i < 12; i++) {
        const listProduct = new ListProduct();
        listProduct.id = faker.datatype.uuid();
        listProduct.name = faker.commerce.productName();
        listProduct.price = parseFloat(faker.commerce.price());
        listProduct.quantity = faker.datatype.number();
        listProduct.purchased = i % 2 === 0 ? true : false;
        listProduct.shoppingList =
          i > 5 ? mockShoppingLists[i - 6] : mockShoppingLists[i];

        mockListProducts.push(listProduct);
      }
    });

    it('should return all List Produts from a Shopping List', async () => {
      const shoppingListId = mockShoppingLists[0].id;
      const products = mockListProducts.filter(
        (product) => product.shoppingList.id === shoppingListId,
      );
      mockListProductsRepository.find.mockReturnValue(products);

      const listProducts = await resolver.getListProductsByShoppingList(
        shoppingListId,
      );

      expect(listProducts).toBeDefined();
      expect(listProducts).toHaveLength(2);
      expect(mockListProductsRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getListProduct', () => {
    const mockUsers: User[] = [];
    const mockShoppingLists: ShoppingList[] = [];
    const mockListProducts: ListProduct[] = [];

    beforeAll(() => {
      for (let i = 0; i < 2; i++) {
        const user = new User();
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.email = faker.internet.email();

        mockUsers.push(user);
      }

      for (let i = 0; i < 6; i++) {
        const shoppingList = new ShoppingList();
        shoppingList.name = faker.name.firstName();
        shoppingList.date = new Date();

        shoppingList.user = i % 2 === 0 ? mockUsers[0] : mockUsers[1];

        mockShoppingLists.push(shoppingList);
      }

      for (let i = 0; i < 12; i++) {
        const listProduct = new ListProduct();
        listProduct.id = faker.datatype.uuid();
        listProduct.name = faker.commerce.productName();
        listProduct.price = parseFloat(faker.commerce.price());
        listProduct.quantity = faker.datatype.number();
        listProduct.purchased = i % 2 === 0 ? true : false;
        listProduct.shoppingList =
          i > 5 ? mockShoppingLists[i - 6] : mockShoppingLists[i];

        mockListProducts.push(listProduct);
      }
    });

    it('should return one List Produts by passing its ID', async () => {
      const id = mockListProducts[0].id;
      mockListProductsRepository.findOne.mockReturnValue(mockListProducts[0]);

      const listProduct = await resolver.getListProduct(id);

      expect(listProduct).toBeDefined();
      expect(listProduct).toEqual(mockListProducts[0]);
      expect(mockListProductsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('getListProductByShoppingList', () => {
    const mockUsers: User[] = [];
    const mockShoppingLists: ShoppingList[] = [];
    const mockListProducts: ListProduct[] = [];

    beforeAll(() => {
      for (let i = 0; i < 2; i++) {
        const user = new User();
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.email = faker.internet.email();

        mockUsers.push(user);
      }

      for (let i = 0; i < 6; i++) {
        const shoppingList = new ShoppingList();
        shoppingList.id = i.toString();
        shoppingList.name = faker.name.firstName();
        shoppingList.date = new Date();

        shoppingList.user = i % 2 === 0 ? mockUsers[0] : mockUsers[1];

        mockShoppingLists.push(shoppingList);
      }

      for (let i = 0; i < 12; i++) {
        const listProduct = new ListProduct();
        listProduct.id = faker.datatype.uuid();
        listProduct.name = faker.commerce.productName();
        listProduct.price = parseFloat(faker.commerce.price());
        listProduct.quantity = faker.datatype.number();
        listProduct.purchased = i % 2 === 0 ? true : false;
        listProduct.shoppingList =
          i > 5 ? mockShoppingLists[i - 6] : mockShoppingLists[i];

        mockListProducts.push(listProduct);
      }
    });

    it('should return one List Produts by passing its ID and Shopping List ID', async () => {
      const shoppingListId = mockShoppingLists[0].id;
      const id = mockShoppingLists[0].listProducts[0].id;
      const product = mockShoppingLists[0].listProducts[0];
      mockListProductsRepository.findOne.mockReturnValue(product);

      const listProduct = await resolver.getListProductByShoppingList(
        id,
        shoppingListId,
      );

      expect(listProduct).toBeDefined();
      expect(listProduct).toEqual(product);
      expect(mockListProductsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('createListProduct', () => {
    const mockUser = new User();
    const mockShoppingList = new ShoppingList();

    beforeAll(() => {
      mockUser.id = faker.datatype.uuid();
      mockUser.firstName = faker.name.firstName();
      mockUser.lastName = faker.name.lastName();
      mockUser.email = faker.internet.email();
      mockUser.password = '12345678';

      mockShoppingList.name = faker.name.firstName();
      mockShoppingList.date = new Date();

      mockShoppingList.user = mockUser;
    });

    it('should create a new List Product and return it', async () => {
      const mockData: ListProductsCreateInput = {
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price()),
        quantity: faker.datatype.number(),
        purchased: false,
      };

      const mockListProduct = new ListProduct();
      mockListProduct.name = mockData.name;
      mockListProduct.price = mockData.price;
      mockListProduct.quantity = mockData.quantity;
      mockListProduct.shoppingList = mockShoppingList;
      mockListProductsRepository.save.mockReturnValue(mockListProduct);
      mockShoppingListsRepository.findOne.mockReturnValue(mockShoppingList);

      const listProduct = await resolver.createListProduct(
        mockData,
        mockShoppingList.id,
      );

      expect(listProduct).toBeDefined();
      expect(listProduct).toEqual(mockListProduct);
      expect(mockListProductsRepository.save).toHaveBeenCalledTimes(1);
      expect(mockShoppingListsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateShoppingList', () => {
    const mockUser = new User();
    const mockShoppingList = new ShoppingList();
    const mockListProduct = new ListProduct();

    beforeAll(() => {
      mockUser.id = faker.datatype.uuid();
      mockUser.firstName = faker.name.firstName();
      mockUser.lastName = faker.name.lastName();
      mockUser.email = faker.internet.email();
      mockUser.password = '12345678';

      mockShoppingList.name = faker.name.firstName();
      mockShoppingList.date = new Date();

      mockShoppingList.user = mockUser;

      mockListProduct.name = faker.commerce.productName();
      mockListProduct.price = faker.datatype.number();
      mockListProduct.quantity = faker.datatype.number();
      mockListProduct.shoppingList = mockShoppingList;
    });

    it('should create a new List Product, update and returns it', async () => {
      const mockValues: ListProductsUpdateInput = {
        name: faker.name.firstName(),
        price: 123.99,
        purchased: true,
        quantity: 123,
      };
      const mockListProduct = new ListProduct();
      mockListProduct.name = mockValues.name;
      mockListProduct.price = mockValues.price;
      mockListProduct.purchased = mockValues.purchased;
      mockListProduct.quantity = mockValues.quantity;
      mockListProductsRepository.findOne.mockReturnValue(mockListProduct);
      mockListProductsRepository.update.mockReturnValue(mockListProduct);

      const listProduct = await resolver.updateListProduct(
        mockListProduct.id,
        mockValues,
        mockShoppingList.id,
      );

      expect(listProduct).toBeDefined();
      expect(listProduct).toEqual(mockListProduct);
      expect(mockListProductsRepository.update).toHaveBeenCalledTimes(1);
      expect(mockListProductsRepository.findOne).toHaveBeenCalledTimes(2);
    });
  });

  describe('deleteListProduct', () => {
    const mockUser = new User();
    const mockShoppingList = new ShoppingList();
    const mockListProduct = new ListProduct();

    beforeAll(() => {
      mockUser.id = faker.datatype.uuid();
      mockUser.firstName = faker.name.firstName();
      mockUser.lastName = faker.name.lastName();
      mockUser.email = faker.internet.email();
      mockUser.password = '12345678';

      mockShoppingList.name = faker.name.firstName();
      mockShoppingList.date = new Date();
      mockShoppingList.user = mockUser;

      mockListProduct.name = faker.commerce.productName();
      mockListProduct.price = faker.datatype.number();
      mockListProduct.quantity = faker.datatype.number();
      mockListProduct.shoppingList = mockShoppingList;
    });

    it('should delete a List Product', async () => {
      const id = mockListProduct.id;
      const shoppingListId = mockShoppingList.id;
      mockListProductsRepository.findOne.mockReturnValue(mockListProduct);
      mockListProductsRepository.delete.mockReturnValue(Promise.resolve());

      expect(await resolver.deleteListProduct(id, shoppingListId)).resolves;
      expect(mockListProductsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockListProductsRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should not delete a List Product if user not found', async () => {
      const id = mockListProduct.id;
      const shoppingListId = 'another shoppingList id';
      mockListProductsRepository.findOne.mockReturnValue(null);

      expect(resolver.deleteListProduct(id, shoppingListId)).rejects.toThrow();
      expect(mockListProductsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockListProductsRepository.delete).toHaveBeenCalledTimes(0);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShoppingList } from '../shopping-lists/shopping-list.entity';
import { ShoppingListsService } from '../shopping-lists/shopping-lists.service';
import { ListProduct } from './list-product.entity';
import { ListProductsResolver } from './list-products.resolver';
import { ListProductsService } from './list-products.service';
import { ListProductsCreateInput } from './inputs/list-products-create.input';
import { ListProductsUpdateInput } from './inputs/list-products-update.input';
import {
  MockRepository,
  MockListProduct,
  MockShoppingList,
  MockConnection,
} from '../../test/mocks';
import * as faker from 'faker';
import { Connection } from 'typeorm';

describe('ListProductsResolver', () => {
  let resolver: ListProductsResolver;

  const mockListProductsRepository = new MockRepository();
  const mockShoppingListsRepository = new MockRepository();
  const mockConnection = new MockConnection();

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
        {
          provide: Connection,
          useValue: mockConnection,
        },
      ],
    }).compile();

    resolver = module.get<ListProductsResolver>(ListProductsResolver);

    jest.clearAllMocks();
  });

  describe('getListProducts', () => {
    let mockListProducts: ListProduct[];

    beforeAll(() => {
      mockListProducts = [];

      for (let i = 0; i < 5; i++) {
        const listProduct = new MockListProduct();
        mockListProducts.push(listProduct);
      }
    });

    it('should return all List Produts', async () => {
      mockListProductsRepository.find.mockReturnValue(mockListProducts);

      const listProducts = await resolver.getListProducts();

      expect(listProducts).toBeDefined();
      expect(listProducts).toHaveLength(5);
      expect(mockListProductsRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getListProductsByShoppingList', () => {
    let mockShoppingList: ShoppingList;
    let mockListProducts: ListProduct[];

    beforeEach(() => {
      mockShoppingList = new MockShoppingList();
      mockListProducts = [];

      for (let i = 0; i < 5; i++) {
        const listProduct = new MockListProduct(mockShoppingList);
        mockListProducts.push(listProduct);
      }
    });

    it('should return all List Produts from a Shopping List', async () => {
      const shoppingListId = mockShoppingList.id;
      mockListProductsRepository.find.mockReturnValue(mockListProducts);

      const listProducts = await resolver.getListProductsByShoppingList(
        shoppingListId,
      );

      expect(listProducts).toBeDefined();
      expect(listProducts).toHaveLength(5);
      expect(mockListProductsRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getListProduct', () => {
    let mockListProducts: ListProduct[];

    beforeEach(() => {
      mockListProducts = [];

      for (let i = 0; i < 5; i++) {
        const listProduct = new MockListProduct();
        mockListProducts.push(listProduct);
      }
    });

    it('should return one List Product by passing its ID', async () => {
      const product = mockListProducts[0];
      const id = product.id;
      mockListProductsRepository.findOne.mockReturnValue(product);

      const listProduct = await resolver.getListProduct(id);

      expect(listProduct).toBeDefined();
      expect(listProduct).toEqual(mockListProducts[0]);
      expect(mockListProductsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('getListProductByShoppingList', () => {
    let mockShoppingList: ShoppingList;
    let mockListProducts: ListProduct[];

    beforeEach(() => {
      mockShoppingList = new MockShoppingList();
      mockListProducts = [];

      for (let i = 0; i < 12; i++) {
        const listProduct = new MockListProduct(mockShoppingList);
        mockListProducts.push(listProduct);
      }
    });

    it('should return one List Produts by passing its ID and Shopping List ID', async () => {
      const shoppingListId = mockShoppingList.id;
      const id = mockListProducts[0].id;
      const product = mockListProducts[0];
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
    let mockShoppingList: ShoppingList;
    let mockListProduct: ListProduct;
    let mockData: ListProductsCreateInput;

    beforeEach(() => {
      mockShoppingList = new MockShoppingList();

      mockData = {
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price()),
        brand: faker.company.companyName(),
        market: faker.company.companyName(),
        quantity: faker.datatype.number(),
        purchased: false,
      };
    });

    it('should create a new List Product and return it', async () => {
      mockListProduct = new MockListProduct(
        mockShoppingList,
        mockData.name,
        mockData.price,
        mockData.brand,
        mockData.market,
        mockData.purchased,
        mockData.quantity,
      );
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

    it('should throw an error if Shopping List not found', async () => {
      const userId = 'invalidId';
      mockShoppingListsRepository.findOne.mockReturnValue(null);

      try {
        await resolver.createListProduct(mockData, userId);
      } catch (err) {
        expect(err).toMatch('Shopping List not found!');
      }
    });
  });

  describe('updateShoppingList', () => {
    let mockShoppingList: ShoppingList;
    let mockListProduct: ListProduct;

    beforeEach(() => {
      mockShoppingList = new ShoppingList();
    });

    it('should create a new List Product, update and returns it', async () => {
      const mockValues: ListProductsUpdateInput = {
        name: faker.name.firstName(),
        price: 123.99,
        purchased: true,
        quantity: 123,
      };
      mockListProduct = new MockListProduct();
      mockListProduct.name = mockValues.name;
      mockListProduct.price = mockValues.price;
      mockListProduct.purchased = mockValues.purchased;
      mockListProduct.quantity = mockValues.quantity;
      mockListProductsRepository.findOne.mockReturnValue(mockListProduct);
      mockListProductsRepository.save.mockReturnValue(mockListProduct);

      const listProduct = await resolver.updateListProduct(
        mockListProduct.id,
        mockValues,
        mockShoppingList.id,
      );

      expect(listProduct).toBeDefined();
      expect(listProduct).toEqual(mockListProduct);
      expect(mockListProductsRepository.save).toHaveBeenCalledTimes(1);
      expect(mockListProductsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteListProduct', () => {
    let mockShoppingList: ShoppingList;
    let mockListProduct: ListProduct;

    beforeEach(() => {
      mockShoppingList = new MockShoppingList();
      mockListProduct = new MockListProduct(mockShoppingList);
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

import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingList } from '../shopping-lists/shopping-list.entity';
import { ListProduct } from './list-product.entity';
import { ListProductsResolver } from './list-products.resolver';
import { ListProductsService } from './list-products.service';
import { ListProductsCreateInput } from './inputs/list-products-create.input';
import { ListProductsUpdateInput } from './inputs/list-products-update.input';
import {
  MockListProduct,
  MockShoppingList,
  MockListProductsService,
} from '../../test/mocks';
import * as faker from 'faker';

describe('ListProductsResolver', () => {
  let resolver: ListProductsResolver;

  const service = new MockListProductsService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListProductsResolver,
        {
          provide: ListProductsService,
          useValue: service,
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
      service.findAll.mockReturnValue(mockListProducts);

      const listProducts = await resolver.getListProducts();

      expect(listProducts).toBeDefined();
      expect(listProducts).toHaveLength(5);
      expect(service.findAll).toHaveBeenCalledTimes(1);
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
      service.findAllByShoppingList.mockReturnValue(mockListProducts);

      const listProducts = await resolver.getListProductsByShoppingList(
        shoppingListId,
      );

      expect(listProducts).toBeDefined();
      expect(listProducts).toHaveLength(5);
      expect(service.findAllByShoppingList).toHaveBeenCalledTimes(1);
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
      service.findOne.mockReturnValue(product);

      const listProduct = await resolver.getListProduct(id);

      expect(listProduct).toBeDefined();
      expect(listProduct).toEqual(mockListProducts[0]);
      expect(service.findOne).toHaveBeenCalledTimes(1);
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
      service.findOneByShoppingList.mockReturnValue(product);

      const listProduct = await resolver.getListProductByShoppingList(
        id,
        shoppingListId,
      );

      expect(listProduct).toBeDefined();
      expect(listProduct).toEqual(product);
      expect(service.findOneByShoppingList).toHaveBeenCalledTimes(1);
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
      service.create.mockReturnValue(mockListProduct);

      const listProduct = await resolver.createListProduct(
        mockData,
        mockShoppingList.id,
      );

      expect(listProduct).toBeDefined();
      expect(listProduct).toEqual(mockListProduct);
      expect(service.create).toHaveBeenCalledTimes(1);
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
      service.update.mockReturnValue(mockListProduct);

      const listProduct = await resolver.updateListProduct(
        mockListProduct.id,
        mockValues,
        mockShoppingList.id,
      );

      expect(listProduct).toBeDefined();
      expect(listProduct).toEqual(mockListProduct);
      expect(service.update).toHaveBeenCalledTimes(1);
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
      service.delete.mockReturnValue(Promise.resolve());

      expect(await resolver.deleteListProduct(id, shoppingListId)).resolves;
      expect(service.delete).toHaveBeenCalledTimes(1);
    });
  });
});

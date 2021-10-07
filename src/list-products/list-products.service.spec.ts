import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShoppingList } from '../shopping-lists/shopping-list.entity';
import { ShoppingListsService } from '../shopping-lists/shopping-lists.service';
import { ListProduct } from './list-product.entity';
import { ListProductsService } from './list-products.service';
import { ListProductsCreateInput } from './inputs/list-products-create.input';
import { ListProductsUpdateInput } from './inputs/list-products-update.input';
import {
  MockListProduct,
  MockRepository,
  MockShoppingList,
} from '../../test/mocks';
import * as faker from 'faker';

describe('ListProductsService', () => {
  let service: ListProductsService;

  const mockListProductsRepository = new MockRepository();
  const mockShoppingListsRepository = new MockRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListProductsService,
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

    service = module.get<ListProductsService>(ListProductsService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    const mockListProducts: ListProduct[] = [];

    beforeEach(() => {
      for (let i = 0; i < 5; i++) {
        const listProduct = new MockListProduct();
        mockListProducts.push(listProduct);
      }
    });

    it('should return all List Produts', async () => {
      mockListProductsRepository.find.mockReturnValue(mockListProducts);

      const listProducts = await service.findAll();

      expect(listProducts).toBeDefined();
      expect(listProducts).toHaveLength(5);
      expect(mockListProductsRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllByShoppingList', () => {
    let mockShoppingList: ShoppingList;
    const mockListProducts: ListProduct[] = [];

    beforeEach(() => {
      mockShoppingList = new MockShoppingList();

      for (let i = 0; i < 5; i++) {
        const listProduct = new MockListProduct(mockShoppingList);
        mockListProducts.push(listProduct);
      }
    });

    it('should return all List Produts from a Shopping List', async () => {
      const shoppingListId = mockShoppingList.id;
      const products = mockListProducts;
      mockListProductsRepository.find.mockReturnValue(products);

      const listProducts = await service.findAllByShoppingList(shoppingListId);

      expect(listProducts).toBeDefined();
      expect(listProducts).toHaveLength(5);
      expect(mockListProductsRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    const mockListProducts: ListProduct[] = [];

    beforeEach(() => {
      for (let i = 0; i < 5; i++) {
        const listProduct = new MockListProduct();
        mockListProducts.push(listProduct);
      }
    });

    it('should return one List Produts by passing its ID', async () => {
      const id = mockListProducts[0].id;
      mockListProductsRepository.findOne.mockReturnValue(mockListProducts[0]);

      const listProduct = await service.findOne(id);

      expect(listProduct).toBeDefined();
      expect(listProduct).toEqual(mockListProducts[0]);
      expect(mockListProductsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneByShoppingList', () => {
    let mockShoppingList: ShoppingList;
    const mockListProducts: ListProduct[] = [];

    beforeEach(() => {
      mockShoppingList = new MockShoppingList();

      for (let i = 0; i < 5; i++) {
        const listProduct = new MockListProduct(mockShoppingList);
        mockListProducts.push(listProduct);
      }
    });

    it('should return one List Product by passing its ID and Shopping List ID', async () => {
      const shoppingListId = mockShoppingList.id;
      const id = mockListProducts[0].id;
      const product = mockListProducts[0];
      mockListProductsRepository.findOne.mockReturnValue(product);

      const listProduct = await service.findOneByShoppingList(
        id,
        shoppingListId,
      );

      expect(listProduct).toBeDefined();
      expect(listProduct).toEqual(product);
      expect(mockListProductsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
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

      const listProduct = await service.create(mockData, mockShoppingList);

      expect(listProduct).toBeDefined();
      expect(listProduct).toEqual(mockListProduct);
      expect(mockListProductsRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
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

      const listProduct = await service.update(
        mockListProduct.id,
        mockValues,
        mockShoppingList.id,
      );

      expect(listProduct).toBeDefined();
      expect(listProduct).toEqual(mockListProduct);
      expect(mockListProductsRepository.save).toHaveBeenCalledTimes(1);
      expect(mockListProductsRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an Error if the List Product is not found', async () => {
      const mockValues: ListProductsUpdateInput = {
        name: faker.name.firstName(),
        price: 123.99,
        purchased: true,
        quantity: 123,
      };
      mockListProductsRepository.findOne.mockReturnValue(null);

      await expect(
        service.update(mockListProduct.id, mockValues, mockShoppingList.id),
      ).rejects.toThrow();
      expect(mockListProductsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
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

      expect(await service.delete(id, shoppingListId)).resolves;
      expect(mockListProductsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockListProductsRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should not delete a List Product if user not found', async () => {
      const id = mockListProduct.id;
      const shoppingListId = mockShoppingList.id;
      mockListProductsRepository.findOne.mockReturnValue(null);

      try {
        service.delete(id, shoppingListId);
      } catch (err) {
        expect(err).toMatch('error');
      }
      expect(mockListProductsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockListProductsRepository.delete).toHaveBeenCalledTimes(0);
    });
  });
});

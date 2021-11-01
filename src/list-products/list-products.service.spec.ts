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
  MockShoppingListsService,
} from '../../test/mocks';
import * as faker from 'faker';

describe('ListProductsService', () => {
  let service: ListProductsService;

  const mockRepository = new MockRepository();
  const mockShoppingListsService = new MockShoppingListsService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListProductsService,
        {
          provide: getRepositoryToken(ListProduct),
          useValue: mockRepository,
        },
        {
          provide: ShoppingListsService,
          useValue: mockShoppingListsService,
        },
      ],
    }).compile();

    service = module.get<ListProductsService>(ListProductsService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    let mockListProducts: ListProduct[];

    beforeEach(() => {
      mockListProducts = [];

      for (let i = 0; i < 5; i++) {
        const listProduct = new MockListProduct();
        mockListProducts.push(listProduct);
      }
    });

    it('should return all List Produts', async () => {
      mockRepository.find.mockReturnValue(mockListProducts);

      const listProducts = await service.findAll();

      expect(listProducts).toBeDefined();
      expect(listProducts).toHaveLength(5);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllByIds', () => {
    let mockListProducts: ListProduct[];

    beforeEach(() => {
      mockListProducts = [];

      for (let i = 0; i < 5; i++) {
        const listProduct = new MockListProduct();
        mockListProducts.push(listProduct);
      }
    });

    it('should receive 2 Ids and return their List Produts', async () => {
      const products = [mockListProducts[0], mockListProducts[1]];
      const ids = products.map((item) => item.id);
      mockRepository.find.mockReturnValue(products);

      const listProducts = await service.findAllByIds(ids);

      expect(listProducts).toBeDefined();
      expect(listProducts).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllByShoppingList', () => {
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
      const products = mockListProducts;
      mockRepository.find.mockReturnValue(products);

      const listProducts = await service.findAllByShoppingList(shoppingListId);

      expect(listProducts).toBeDefined();
      expect(listProducts).toHaveLength(5);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllPendingByShoppingLists', () => {
    let mockShoppingLists: ShoppingList[];
    let listProducts: ListProduct[];

    beforeEach(() => {
      mockShoppingLists = [];
      listProducts = [];

      //Creates 3 Shopping Lists
      for (let i = 0; i < 3; i++) {
        const mockShoppingList = new MockShoppingList();

        mockShoppingLists.push(mockShoppingList);
      }

      //Will create a structure as below:
      /*
        shoppingLists: [
          shoppingList0 { 
            listProducts: [
              product0: {
                name: Purchased,
                purchased: true
              },
              product3: {
                name: Not Purchased,
                purchased: false
              },
              product6: {
                name: Purchased,
                purchased: true
              },
              product9: {
                name: Not Purchased,
                purchased: false
              },
            ]
          },
          shoppingList1 { 
            listProducts: [
              product1: {
                name: Not Purchased,
                purchased: false
              },
              product4: {
                name: Purchased,
                purchased: true
              },
               product7: {
                name: Not Purchased,
                purchased: false
              },
               product4: {
                name: Purchased,
                purchased: true
              },
            ]
          },
          shoppingList2 { 
            listProducts: [
              product2: {
                name: Purchased,
                purchased: true
              },
              product5: {
                name: Not Purchased,
                purchased: false
              },
              product8: {
                name: Purchased,
                purchased: true
              },
              product11: {
                name: Not Purchased,
                purchased: false
              },
            ]
          }
        ]
      */
      let index = 0;
      for (let i = 0; i < 12; i++) {
        if (index === 3) index = 0;

        const shoppingList = mockShoppingLists[index++];

        const listProduct = new MockListProduct(
          shoppingList,
          i % 2 === 0 ? 'Purchased' : 'Not Purchased',
        );
        listProduct.purchased = i % 2 === 0;

        listProducts.push(listProduct);
      }
    });

    it('should return all List Produts not purchased from a Shopping List', async () => {
      const shoppingListsId = mockShoppingLists.map((item) => item.id);
      const pendingListProducts = listProducts.filter((item) => item.purchased);
      mockRepository.find.mockReturnValue(pendingListProducts);

      const products = await service.findAllPendingByShoppingLists(
        shoppingListsId,
      );

      expect(products).toBeDefined();
      expect(products).toHaveLength(6);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    let mockListProducts: ListProduct[];

    beforeEach(() => {
      mockListProducts = [];

      for (let i = 0; i < 5; i++) {
        const listProduct = new MockListProduct();
        mockListProducts.push(listProduct);
      }
    });

    it('should return one List Produts by passing its ID', async () => {
      const id = mockListProducts[0].id;
      mockRepository.findOne.mockReturnValue(mockListProducts[0]);

      const listProduct = await service.findOne(id);

      expect(listProduct).toBeDefined();
      expect(listProduct).toEqual(mockListProducts[0]);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneByShoppingList', () => {
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

    it('should return one List Product by passing its ID and Shopping List ID', async () => {
      const shoppingListId = mockShoppingList.id;
      const id = mockListProducts[0].id;
      const product = mockListProducts[0];
      mockRepository.findOne.mockReturnValue(product);

      const listProduct = await service.findOneByShoppingList(
        id,
        shoppingListId,
      );

      expect(listProduct).toBeDefined();
      expect(listProduct).toEqual(product);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
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
      const shoppingListId = mockShoppingList.id;
      mockListProduct = new MockListProduct(
        mockShoppingList,
        mockData.name,
        mockData.price,
        mockData.brand,
        mockData.market,
        mockData.purchased,
        mockData.quantity,
      );
      mockShoppingListsService.findOne.mockReturnValue(mockShoppingList);
      mockRepository.save.mockReturnValue(mockListProduct);

      const listProduct = await service.create(mockData, shoppingListId);

      expect(listProduct).toBeDefined();
      expect(listProduct).toEqual(mockListProduct);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
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
      mockRepository.findOne.mockReturnValue(mockListProduct);
      mockRepository.save.mockReturnValue(mockListProduct);

      const listProduct = await service.update(
        mockListProduct.id,
        mockValues,
        mockShoppingList.id,
      );

      expect(listProduct).toBeDefined();
      expect(listProduct).toEqual(mockListProduct);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an Error if the List Product is not found', async () => {
      const mockValues: ListProductsUpdateInput = {
        name: faker.name.firstName(),
        price: 123.99,
        purchased: true,
        quantity: 123,
      };
      mockRepository.findOne.mockReturnValue(null);

      await expect(
        service.update(mockListProduct.id, mockValues, mockShoppingList.id),
      ).rejects.toThrow();
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    let mockShoppingList: ShoppingList;
    let mockListProduct: ListProduct;

    beforeEach(() => {
      mockShoppingList = new MockShoppingList();
      mockListProduct = new MockListProduct(mockShoppingList);
    });

    it('should delete a List Product', async () => {
      const id = mockListProduct.id;
      const shoppingListId = mockShoppingList.id;
      mockRepository.findOne.mockReturnValue(mockListProduct);
      mockRepository.delete.mockReturnValue(Promise.resolve());

      expect(await service.delete(id, shoppingListId)).resolves;
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should not delete a List Product if user not found', async () => {
      const id = mockListProduct.id;
      const shoppingListId = mockShoppingList.id;
      mockRepository.findOne.mockReturnValue(null);

      try {
        service.delete(id, shoppingListId);
      } catch (err) {
        expect(err).toMatch('error');
      }
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledTimes(0);
    });
  });

  describe('removeMany', () => {
    let mockShoppingList: ShoppingList;
    let mockListProducts: ListProduct[];

    beforeEach(() => {
      mockShoppingList = new MockShoppingList();
      mockListProducts = [];

      for (let i = 0; i < 5; i++) {
        const mockListProduct = new MockListProduct(mockShoppingList);
        mockListProducts.push(mockListProduct);
      }
    });

    it('should receive a list of Ids and remove their List Products', async () => {
      const products = [mockListProducts[0], mockListProducts[1]];
      const ids = products.map((item) => item.id);
      mockRepository.find.mockReturnValue(products);
      mockRepository.delete.mockReturnValue(Promise.resolve());

      expect(await service.removeMany(ids)).resolves;
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
      expect(mockRepository.remove).toHaveBeenCalledTimes(1);
    });
  });
});

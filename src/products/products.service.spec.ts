import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { ProductsCreateInput } from './inputs/products-create.input';
import { ProductsUpdateInput } from './inputs/products-update.input';
import { User } from '../users/user.entity';
import {
  MockRepository,
  MockUser,
  MockProduct,
  MockUsersService,
} from '../../test/mocks';
import * as faker from 'faker';
import { UsersService } from '../users/users.service';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockRepository = new MockRepository();
  const mockUsersService = new MockUsersService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    let mockProducts: Product[];

    beforeEach(() => {
      mockProducts = [];

      for (let i = 0; i < 5; i++) {
        const product = new MockProduct();
        mockProducts.push(product);
      }
    });

    it('should find all Products ', async () => {
      mockRepository.find.mockReturnValue(mockProducts);

      const products = await service.findAll();

      expect(products).toBeDefined();
      expect(products).toHaveLength(5);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllByUser', () => {
    let mockUser: User;
    let mockProducts: Product[];

    beforeEach(() => {
      mockProducts = [];
      mockUser = new MockUser();

      for (let i = 0; i < 5; i++) {
        const product = new MockProduct(mockUser);

        mockProducts.push(product);
      }
    });

    it('should find all Products by User', async () => {
      const userId = mockUser.id;
      mockRepository.find.mockReturnValue(mockProducts);

      const products = await service.findAllByUser(userId);

      expect(products).toBeDefined();
      expect(products).toHaveLength(5);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    let mockProduct: Product;

    beforeAll(() => {
      mockProduct = new MockProduct();
    });

    it('should find an Product by passing its ID ', async () => {
      const id = mockProduct.id;
      mockRepository.findOne.mockReturnValue(mockProduct);

      const product = await service.findOne(id);

      expect(product).toBeDefined();
      expect(product).toEqual(mockProduct);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    let mockUser: User;
    let mockProduct: Product;

    beforeEach(() => {
      mockUser = new MockUser();
    });

    it('should create a new Product and returns it', async () => {
      const userId = mockUser.id;
      const mockData: ProductsCreateInput = {
        name: faker.commerce.productName(),
        price: faker.datatype.number(),
        market: faker.company.companyName(),
        brand: faker.company.companyName(),
      };
      mockProduct = new MockProduct(
        mockUser,
        mockData.name,
        mockData.price,
        mockData.brand,
        mockData.market,
      );
      mockUsersService.findOne.mockReturnValue(mockUser);
      mockRepository.save.mockReturnValue(mockProduct);

      const product = await service.create(mockData, userId);

      expect(product).toBeDefined();
      expect(product).toEqual(mockProduct);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    let mockUser: User;
    let mockProduct: Product;

    beforeEach(() => {
      mockUser = new MockUser();
      mockProduct = new MockProduct(mockUser);
    });

    it('should update firstname and lastname of an Product and returns it', async () => {
      const mockValues: ProductsUpdateInput = {
        name: 'A new name',
        price: 12.34,
        market: 'A new market',
        brand: 'A new brand',
      };
      mockProduct.name = mockValues.name;
      mockProduct.price = mockValues.price;
      mockProduct.market = mockValues.market;
      mockProduct.brand = mockValues.brand;
      mockRepository.findOne.mockReturnValue(mockProduct);
      const id = mockProduct.id;

      const product = await service.update(id, mockValues);

      expect(product).toBeDefined();
      expect(product.name).toEqual(mockValues.name);
      expect(product.price).toEqual(mockValues.price);
      expect(product.market).toEqual(mockValues.market);
      expect(product.brand).toEqual(mockValues.brand);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if product not found', async () => {
      const mockValues: ProductsUpdateInput = {
        name: 'A new name',
        price: 12.34,
        market: 'A new market',
        brand: 'A new brand',
      };
      const id = 'invalidId';
      mockRepository.findOne.mockReturnValue(null);

      await expect(service.update(id, mockValues)).rejects.toThrow();
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    let mockProduct: Product;

    beforeEach(() => {
      mockProduct = new MockProduct();
    });

    it('should soft delete an Product', async () => {
      const id = mockProduct.id;
      mockRepository.delete.mockReturnValue(Promise.resolve());

      expect(await service.delete(id)).resolves;
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});

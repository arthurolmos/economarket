import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import * as faker from 'faker';
import { ProductsCreateInput } from './inputs/products-create.input';
import { ProductsUpdateInput } from './inputs/products-update.input';
import { User } from '../users/user.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  const mockProductsRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    restore: jest.fn(),
  };

  const mockUsersRepository = {
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
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductsRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    const mockProducts: Product[] = [];

    beforeAll(() => {
      for (let i = 0; i < 5; i++) {
        const product = new Product();
        product.name = faker.commerce.product();
        product.price = faker.datatype.number();
        product.market = faker.company.companyName();
        product.brand = faker.company.companyName();

        mockProducts.push(product);
      }
    });

    it('should find all Products ', async () => {
      mockProductsRepository.find.mockReturnValue(mockProducts);

      const products = await service.findAll();

      expect(products).toBeDefined();
      expect(products).toHaveLength(5);
      expect(mockProductsRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllByUser', () => {
    const mockProducts: Product[] = [];
    const users: User[] = [];

    beforeAll(() => {
      for (let i = 0; i < 2; i++) {
        const user = new User();
        user.id = faker.datatype.uuid();

        users.push(user);
      }

      for (let i = 0; i < 5; i++) {
        const product = new Product();
        product.name = faker.commerce.product();
        product.price = faker.datatype.number();
        product.market = faker.company.companyName();
        product.brand = faker.company.companyName();

        product.user = users[i % 2];

        mockProducts.push(product);
      }
    });

    it('should find all Products by User', async () => {
      mockProductsRepository.find.mockReturnValue(
        mockProducts.filter((product) => product.user.id === users[1].id),
      );

      const products = await service.findAllByUser(users[1].id);

      expect(products).toBeDefined();
      expect(products).toHaveLength(2);
      expect(mockProductsRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    const mockProduct = new Product();

    beforeAll(() => {
      mockProduct.id = faker.datatype.uuid();
      mockProduct.name = faker.commerce.productName();
      mockProduct.price = faker.datatype.number();
      mockProduct.market = faker.company.companyName();
      mockProduct.brand = faker.company.companyName();
    });

    it('should find an Product by passing its ID ', async () => {
      const id = mockProduct.id;
      mockProductsRepository.findOne.mockReturnValue(mockProduct);

      const product = await service.findOne(id);

      expect(product).toBeDefined();
      expect(product).toEqual(mockProduct);
      expect(mockProductsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    let mockData: ProductsCreateInput;
    const user = new User();

    beforeAll(() => {
      mockData = {
        name: faker.commerce.productName(),
        price: faker.datatype.number(),
        market: faker.company.companyName(),
        brand: faker.company.companyName(),
      };
    });

    it('should create a new Product and returns it', async () => {
      const mockProduct = new Product();
      mockProduct.name = mockData.name;
      mockProduct.price = mockData.price;
      mockProduct.market = mockData.market;
      mockProduct.brand = mockData.brand;
      mockProductsRepository.save.mockReturnValue(mockProduct);
      mockUsersRepository.findOne.mockReturnValue(user);

      const product = await service.create(mockData, user);

      expect(product).toBeDefined();
      expect(product).toEqual(mockProduct);
      expect(mockProductsRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    const mockProduct = new Product();

    beforeAll(() => {
      mockProduct.id = faker.datatype.uuid();
      mockProduct.name = faker.commerce.productName();
      mockProduct.price = faker.datatype.number();
      mockProduct.market = faker.company.companyName();
      mockProduct.brand = faker.company.companyName();
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
      mockProductsRepository.findOne.mockReturnValue(mockProduct);
      const id = mockProduct.id;

      const product = await service.update(id, mockValues);

      expect(product).toBeDefined();
      expect(product.name).toEqual(mockValues.name);
      expect(product.price).toEqual(mockValues.price);
      expect(product.market).toEqual(mockValues.market);
      expect(product.brand).toEqual(mockValues.brand);
      expect(mockProductsRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if product not found', async () => {
      const mockValues: ProductsUpdateInput = {
        name: 'A new name',
        price: 12.34,
        market: 'A new market',
        brand: 'A new brand',
      };
      const id = 'invalidId';
      mockProductsRepository.findOne.mockReturnValue(null);

      await expect(service.update(id, mockValues)).rejects.toThrow();
      expect(mockProductsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    const mockProduct = new Product();

    beforeAll(() => {
      mockProduct.id = faker.datatype.uuid();
      mockProduct.name = faker.commerce.productName();
      mockProduct.price = faker.datatype.number();
      mockProduct.market = faker.company.companyName();
      mockProduct.brand = faker.company.companyName();
    });

    it('should soft delete an Product', async () => {
      const id = mockProduct.id;
      mockProductsRepository.delete.mockReturnValue(Promise.resolve());

      expect(await service.delete(id)).resolves;
      expect(mockProductsRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});

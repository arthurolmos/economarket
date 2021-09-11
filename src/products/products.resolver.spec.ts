import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import * as faker from 'faker';
import { ProductsCreateInput } from './inputs/products-create.input';
import { ProductsUpdateInput } from './inputs/products-update.input';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

describe('ProductsResolver', () => {
  let resolver: ProductsResolver;

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
        ProductsResolver,
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductsRepository,
        },
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    resolver = module.get<ProductsResolver>(ProductsResolver);

    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    const mockProducts: Product[] = [];

    beforeAll(() => {
      const user = new User();
      user.id = faker.datatype.uuid();

      for (let i = 0; i < 5; i++) {
        const product = new Product();
        product.name = faker.commerce.product();
        product.price = faker.datatype.number();
        product.market = faker.company.companyName();
        product.brand = faker.company.companyName();

        product.user = user;

        mockProducts.push(product);
      }
    });

    it('should return all Products', async () => {
      mockProductsRepository.find.mockReturnValue(mockProducts);

      const products = await resolver.getProducts();

      expect(products).toBeDefined();
      expect(products).toHaveLength(5);
    });
  });

  describe('getProductsByUser', () => {
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

    it('should return all Products by User', async () => {
      mockProductsRepository.find.mockReturnValue(
        mockProducts.filter((product) => product.user.id === users[1].id),
      );

      const products = await resolver.getProductsByUser(users[1].id);

      expect(products).toBeDefined();
      expect(products).toHaveLength(2);
    });
  });

  describe('getProduct', () => {
    const mockProduct = new Product();

    beforeAll(() => {
      mockProduct.id = faker.datatype.uuid();
      mockProduct.name = faker.commerce.product();
      mockProduct.price = faker.datatype.number();
      mockProduct.market = faker.company.companyName();
      mockProduct.brand = faker.company.companyName();
    });

    it('should return an Product by passing its ID', async () => {
      const id = mockProduct.id;
      mockProductsRepository.findOne.mockReturnValue(mockProduct);

      const product = await resolver.getProduct(id);

      expect(product).toBeDefined();
      expect(product).toEqual(mockProduct);
      expect(mockProductsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('createProduct', () => {
    let mockData: ProductsCreateInput;
    const user = new User();

    beforeAll(() => {
      user.id = faker.datatype.uuid();

      mockData = {
        name: faker.commerce.product(),
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
      const userId = user.id;

      const product = await resolver.createProduct(mockData, userId);

      expect(product).toBeDefined();
      expect(product).toEqual(mockProduct);
      expect(mockProductsRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if User not found', async () => {
      const userId = 'invalidId';
      mockUsersRepository.findOne.mockReturnValue(null);

      try {
        await resolver.createProduct(mockData, userId);
      } catch (err) {
        expect(err).toMatch('User not found!');
      }
    });
  });

  describe('updateProduct', () => {
    const mockProduct = new Product();

    beforeAll(() => {
      mockProduct.name = faker.commerce.product();
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

      const product = await resolver.updateProduct(id, mockValues);

      expect(product).toBeDefined();
      expect(product.name).toEqual(mockValues.name);
      expect(product.price).toEqual(mockValues.price);
      expect(product.market).toEqual(mockValues.market);
      expect(product.brand).toEqual(mockValues.brand);
      expect(mockProductsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteProduct', () => {
    const mockProduct = new Product();

    beforeAll(() => {
      mockProduct.name = faker.commerce.product();
      mockProduct.price = faker.datatype.number();
      mockProduct.market = faker.company.companyName();
      mockProduct.brand = faker.company.companyName();
    });

    it('should delete an Product', async () => {
      const id = mockProduct.id;
      mockProductsRepository.delete.mockReturnValue(Promise.resolve());

      expect(await resolver.deleteProduct(id)).resolves;
      expect(mockProductsRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});

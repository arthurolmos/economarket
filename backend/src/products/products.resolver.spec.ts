import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import * as faker from 'faker';
import { ProductsCreateInput } from './inputs/products-create.input';
import { ProductsUpdateInput } from './inputs/products-update.input';

describe('ProductsResolver', () => {
  let resolver: ProductsResolver;
  let service: ProductsService;

  const mockRepository = {
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
          useValue: mockRepository,
        },
      ],
    }).compile();

    resolver = module.get<ProductsResolver>(ProductsResolver);
    service = module.get<ProductsService>(ProductsService);

    jest.clearAllMocks();
  });

  describe('getProducts', () => {
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

    it('should return all Products', async () => {
      mockRepository.find.mockReturnValue(mockProducts);

      const products = await resolver.getProducts();

      expect(products).toBeDefined();
      expect(products).toHaveLength(5);
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
      mockRepository.findOne.mockReturnValue(mockProduct);

      const product = await resolver.getProduct(id);

      expect(product).toBeDefined();
      expect(product).toEqual(mockProduct);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('createProduct', () => {
    let mockData: ProductsCreateInput;

    beforeAll(() => {
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
      mockRepository.save.mockReturnValue(mockProduct);

      const product = await resolver.createProduct(mockData);

      expect(product).toBeDefined();
      expect(product).toEqual(mockProduct);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
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
      mockRepository.findOne.mockReturnValue(mockProduct);
      const id = mockProduct.id;

      const product = await resolver.updateProduct(id, mockValues);

      expect(product).toBeDefined();
      expect(product.name).toEqual(mockValues.name);
      expect(product.price).toEqual(mockValues.price);
      expect(product.market).toEqual(mockValues.market);
      expect(product.brand).toEqual(mockValues.brand);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
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
      mockRepository.delete.mockReturnValue(Promise.resolve());

      expect(await resolver.deleteProduct(id)).resolves;
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});

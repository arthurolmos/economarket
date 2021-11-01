import { Test, TestingModule } from '@nestjs/testing';
import { Product } from './product.entity';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { ProductsCreateInput } from './inputs/products-create.input';
import { ProductsUpdateInput } from './inputs/products-update.input';
import { User } from '../users/user.entity';
import { MockUser, MockProduct, MockProductsService } from '../../test/mocks';
import * as faker from 'faker';

describe('ProductsResolver', () => {
  let resolver: ProductsResolver;

  const service = new MockProductsService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsResolver,
        {
          provide: ProductsService,
          useValue: service,
        },
      ],
    }).compile();

    resolver = module.get<ProductsResolver>(ProductsResolver);

    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    let mockProducts: Product[];

    beforeEach(() => {
      mockProducts = [];

      for (let i = 0; i < 5; i++) {
        const product = new MockProduct();
        mockProducts.push(product);
      }
    });

    it('should return all Products', async () => {
      service.findAll.mockReturnValue(mockProducts);

      const products = await resolver.getProducts();

      expect(products).toBeDefined();
      expect(products).toHaveLength(5);
    });
  });

  describe('getProductsByUser', () => {
    let mockUser: User;
    let mockProducts: Product[];

    beforeEach(() => {
      mockUser = new MockUser();
      mockProducts = [];

      for (let i = 0; i < 5; i++) {
        const product = new MockProduct(mockUser);
        mockProducts.push(product);
      }
    });

    it('should return all Products by User', async () => {
      const userId = mockUser.id;
      service.findAllByUser.mockReturnValue(mockProducts);

      const products = await resolver.getProductsByUser(userId);

      expect(products).toBeDefined();
      expect(products).toHaveLength(5);
      expect(service.findAllByUser).toBeCalledTimes(1);
    });
  });

  describe('getProduct', () => {
    let mockProduct: Product;

    beforeEach(() => {
      mockProduct = new MockProduct();
    });

    it('should return an Product by passing its ID', async () => {
      const id = mockProduct.id;
      service.findOne.mockReturnValue(mockProduct);

      const product = await resolver.getProduct(id);

      expect(product).toBeDefined();
      expect(product).toEqual(mockProduct);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('createProduct', () => {
    let mockUser: User;
    let mockProduct: Product;

    beforeEach(() => {
      mockUser = new MockUser();
    });

    it('should create a new Product and returns it', async () => {
      const mockData: ProductsCreateInput = {
        name: faker.commerce.product(),
        price: faker.datatype.number(),
        market: faker.company.companyName(),
        brand: faker.company.companyName(),
      };

      mockProduct = new MockProduct(
        mockUser,
        mockData.name,
        mockData.price,
        mockData.market,
        mockData.brand,
      );
      service.create.mockReturnValue(mockProduct);
      const userId = mockUser.id;

      const product = await resolver.createProduct(mockData, userId);

      expect(product).toBeDefined();
      expect(product).toEqual(mockProduct);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateProduct', () => {
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
      service.update.mockReturnValue(mockProduct);
      const id = mockProduct.id;

      const product = await resolver.updateProduct(id, mockValues);

      expect(product).toBeDefined();
      expect(product.name).toEqual(mockValues.name);
      expect(product.price).toEqual(mockValues.price);
      expect(product.market).toEqual(mockValues.market);
      expect(product.brand).toEqual(mockValues.brand);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteProduct', () => {
    let mockProduct: Product;

    beforeEach(() => {
      mockProduct = new MockProduct();
    });

    it('should delete an Product', async () => {
      const id = mockProduct.id;
      service.delete.mockReturnValue(Promise.resolve());

      expect(await resolver.deleteProduct(id)).resolves;
      expect(service.delete).toHaveBeenCalledTimes(1);
    });
  });
});

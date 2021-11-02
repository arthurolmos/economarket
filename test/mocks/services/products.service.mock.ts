import { ProductsService } from '../../../src/products/products.service';

export class MockProductsService extends ProductsService {
  constructor() {
    super(null, null);
  }

  create = jest.fn();
  delete = jest.fn();
  findOne = jest.fn();
  update = jest.fn();
  findAllByUser = jest.fn();
  findAll = jest.fn();
}

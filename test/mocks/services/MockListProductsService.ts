import { ListProductsService } from '../../../src/list-products/list-products.service';

export class MockListProductsService extends ListProductsService {
  constructor() {
    super(null, null);
  }

  create = jest.fn();
  delete = jest.fn();
  findAll = jest.fn();
  findAllByIds = jest.fn();
  findAllByShoppingList = jest.fn();
  findAllPendingByShoppingLists = jest.fn();
  findOne = jest.fn();
  findOneByShoppingList = jest.fn();
  removeMany = jest.fn();
  update = jest.fn();
}

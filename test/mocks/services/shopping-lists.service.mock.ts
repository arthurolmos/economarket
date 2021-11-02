import { ShoppingListsService } from '../../../src/shopping-lists/shopping-lists.service';

export class MockShoppingListsService extends ShoppingListsService {
  constructor() {
    super(null, null, null);
  }

  addSharedUsersToShoppingList = jest.fn();
  create = jest.fn();
  createShoppingListFromPendingProducts = jest.fn();
  createShoppingListFromShoppingLists = jest.fn();
  delete = jest.fn();
  deleteSharedUserFromShoppingList = jest.fn();
  findAll = jest.fn();
  findAllByUser = jest.fn();
  findOne = jest.fn();
  findOneByUser = jest.fn();
  update = jest.fn();
}

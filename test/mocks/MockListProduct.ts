import * as faker from 'faker';
import { ListProduct } from '../../src/list-products/list-product.entity';
import { MockShoppingList } from '.';

export class MockListProduct extends ListProduct {
  constructor(
    shoppingList = new MockShoppingList(),

    name = faker.commerce.productName(),
    price = parseFloat(faker.commerce.price()),
    brand = faker.company.companyName(),
    market = faker.company.companyName(),

    purchased = false,
    quantity = 1,

    productId = faker.datatype.uuid(),
  ) {
    super();

    this.id = faker.datatype.uuid();
    this.name = name;
    this.price = price;
    this.brand = brand;
    this.market = market;

    this.purchased = purchased;
    this.quantity = quantity;
    this.shoppingList = shoppingList;

    this.productId = productId;
    this.user = shoppingList?.user;

    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

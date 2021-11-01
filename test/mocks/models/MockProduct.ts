import { Product } from '../../../src/products/product.entity';
import { MockUser } from './MockUser';
import * as faker from 'faker';
import { User } from '../../../src/users/user.entity';

export class MockProduct extends Product {
  constructor(
    user: User | MockUser = new MockUser(),
    name = faker.commerce.productName(),
    price = parseFloat(faker.commerce.price()),
    brand = faker.company.companyName(),
    market = faker.company.companyName(),
  ) {
    super();

    this.id = faker.datatype.uuid();
    this.name = name;
    this.price = price;
    this.brand = brand;
    this.market = market;

    this.user = user;

    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

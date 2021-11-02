import { User } from '../../../src/users/user.entity';
import * as bcrypt from 'bcrypt';
import * as faker from 'faker';

export class MockUser extends User {
  constructor(
    firstName = faker.name.firstName(),
    lastName = faker.name.lastName(),
    email = faker.internet.email(),
    password = '123',
  ) {
    super();

    this.id = faker.datatype.uuid();
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;

    this.originalPassword = password;
    this.password = bcrypt.hashSync(password, 10);

    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public originalPassword;
}

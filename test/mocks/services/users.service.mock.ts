import { UsersService } from '../../../src/users/users.service';

export class MockUsersService extends UsersService {
  constructor() {
    super(null);
  }

  create = jest.fn();
  delete = jest.fn();
  findAll = jest.fn();
  findAllByEmail = jest.fn();
  findAllById = jest.fn();
  findOne = jest.fn();
  findOneByEmail = jest.fn();
  restore = jest.fn();
  update = jest.fn();
}

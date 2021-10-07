export class MockRepository {
  find = jest.fn();
  findOne = jest.fn();
  save = jest.fn();
  update = jest.fn();
  delete = jest.fn();
  softDelete = jest.fn();
  restore = jest.fn();
  createQueryBuilder = jest.fn();
}

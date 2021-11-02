import { AuthService } from '../../../src/auth/auth.service';

export class MockAuthService extends AuthService {
  constructor() {
    super(null, null);
  }

  generateJWTToken = jest.fn();
  getUserByEmail = jest.fn();
  getUserById = jest.fn();
  login = jest.fn();
  register = jest.fn();
  validateUser = jest.fn();
}

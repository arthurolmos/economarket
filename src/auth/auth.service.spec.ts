import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserCreateInput } from '../users/inputs/user-create.input';
import { MockUser, MockUsersService } from '../../test/mocks';
import * as faker from 'faker';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = new MockUsersService();

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
        }),
      ],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    let mockUser: User;

    beforeEach(async () => {
      mockUser = new MockUser();
    });

    it('should receive an id and return the User', async () => {
      const id = mockUser.id;
      mockUsersService.findOne.mockReturnValue(mockUser);

      const user = await service.getUserById(id);

      expect(user).toBeDefined();
      expect(mockUsersService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should receive an wrong id and return null', async () => {
      const id = 'invalid-id';
      mockUsersService.findOne.mockReturnValue(null);

      const user = await service.getUserById(id);

      expect(user).toBeNull();
      expect(mockUsersService.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserByEmail', () => {
    let mockUser: User;

    beforeEach(async () => {
      mockUser = new MockUser();
    });

    it('should receive an email and return the User', async () => {
      const email = mockUser.email;
      mockUsersService.findOneByEmail.mockReturnValue(mockUser);

      const user = await service.getUserByEmail(email);

      expect(user).toBeDefined();
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledTimes(1);
    });

    it('should receive an wrong email and return null', async () => {
      const email = 'invalid-email';
      mockUsersService.findOneByEmail.mockReturnValue(null);

      const user = await service.getUserByEmail(email);

      expect(user).toBeNull();
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('validateUser', () => {
    let mockUser: MockUser;

    beforeEach(async () => {
      mockUser = new MockUser();
    });

    it('should receive a valid username, a valid password and return true', async () => {
      const email = mockUser.email;
      const password = mockUser.originalPassword;
      mockJwtService.sign.mockReturnValue('jwttoken');
      mockUsersService.findOneByEmail.mockReturnValue(mockUser);

      const resp = await service.validateUser(email, password);

      expect(resp).toBeTruthy();
      expect(mockJwtService.sign).toHaveBeenCalledTimes(1);
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledTimes(1);
    });

    it('should receive a valid username, an invalid password and throw an error', async () => {
      const email = mockUser.email;
      const password = 'invalidPassword';
      mockUsersService.findOneByEmail.mockReturnValue(mockUser);

      await expect(service.validateUser(email, password)).rejects.toThrow();
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledTimes(1);
    });

    it('should receive an invalid username, a password and throw an error', async () => {
      const email = 'invalidEmail';
      const password = mockUser.originalPassword;
      mockUsersService.findOneByEmail.mockReturnValue(null);

      await expect(service.validateUser(email, password)).rejects.toThrow();
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    let mockUser: MockUser;

    beforeEach(async () => {
      mockUser = new MockUser();
    });

    it('should receive an user and return User and JWT Token', async () => {
      mockJwtService.sign.mockReturnValue('jwttoken');

      const { user, token } = await service.login(mockUser);

      expect(user).toBeDefined();
      expect(token).toBeDefined();
      expect(mockJwtService.sign).toHaveBeenCalledTimes(1);
    });
  });

  describe('register', () => {
    let mockUser: User;

    beforeEach(async () => {
      mockUser = new MockUser();
    });

    it('should receive an user data and return a new User and JWT Token', async () => {
      const data: UserCreateInput = {
        email: mockUser.email,
        password: '12345678',
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
      };
      mockUsersService.findOneByEmail.mockReturnValue(null);
      mockJwtService.sign.mockReturnValue('jwttoken');
      mockUsersService.create.mockReturnValue(mockUser);

      const { user, token } = await service.register(data);

      expect(user).toBeDefined();
      expect(token).toBeDefined();
      expect(mockJwtService.sign).toHaveBeenCalledTimes(1);
      expect(mockUsersService.create).toHaveBeenCalledTimes(1);
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledTimes(1);
    });

    it('should receive an existing email, a password and throw an Error', async () => {
      const data: UserCreateInput = {
        email: mockUser.email,
        password: '12345678',
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
      };
      mockUsersService.findOneByEmail.mockReturnValue(mockUser);

      await expect(service.register(data)).rejects.toThrowError();
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('generateJWTToken', () => {
    it('should receive a username and id and return a JWT Token', async () => {
      const username = faker.internet.email();
      const id = faker.datatype.uuid();
      mockJwtService.sign.mockReturnValue('jwttoken');

      const payload = { username, sub: id };

      const token = service.generateJWTToken(payload);

      expect(token).toBeDefined();
      expect(mockJwtService.sign).toHaveBeenCalledTimes(1);
    });
  });
});

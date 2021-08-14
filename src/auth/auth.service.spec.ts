import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as faker from 'faker';
import { UserCreateInput } from '../users/inputs/user-create.input';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    restore: jest.fn(),
  };

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
          useClass: UsersService,
        },

        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    let mockUser: User;

    beforeEach(async () => {
      mockUser = new User();
      mockUser.id = faker.datatype.uuid();
      mockUser.email = faker.internet.email();
      mockUser.password = '12345678';
      await mockUser.encryptPassword();
    });

    it('should receive an id and return the User', async () => {
      const id = mockUser.id;
      mockUsersRepository.findOne.mockReturnValue(mockUser);

      const user = await service.getUserById(id);

      expect(user).toBeDefined();
      expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should receive an wrong id and return null', async () => {
      const id = 'invalid-id';
      mockUsersRepository.findOne.mockReturnValue(null);

      const user = await service.getUserById(id);

      expect(user).toBeNull();
      expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserByEmail', () => {
    let mockUser: User;

    beforeEach(async () => {
      mockUser = new User();
      mockUser.id = faker.datatype.uuid();
      mockUser.email = faker.internet.email();
      mockUser.password = '12345678';
      await mockUser.encryptPassword();
    });

    it('should receive an email and return the User', async () => {
      const email = mockUser.email;
      mockUsersRepository.findOne.mockReturnValue(mockUser);

      const user = await service.getUserByEmail(email);

      expect(user).toBeDefined();
      expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should receive an wrong email and return null', async () => {
      const email = 'invalid-email';
      mockUsersRepository.findOne.mockReturnValue(null);

      const user = await service.getUserByEmail(email);

      expect(user).toBeNull();
      expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    let mockUser: User;

    beforeEach(async () => {
      mockUser = new User();
      mockUser.id = faker.datatype.uuid();
      mockUser.email = faker.internet.email();
      mockUser.password = '12345678';
      await mockUser.encryptPassword();
    });

    it('should receive an username, a password and return User and JWT Token', async () => {
      const username = mockUser.email;
      const password = '12345678';
      mockJwtService.sign.mockReturnValue('jwttoken');
      mockUsersRepository.findOne.mockReturnValue(mockUser);

      const { user, token } = await service.login(username, password);

      expect(user).toBeDefined();
      expect(token).toBeDefined();
      expect(mockJwtService.sign).toHaveBeenCalledTimes(1);
      expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should receive an invalid username, a password and throw an Error', async () => {
      const username = 'invalid-email';
      const password = mockUser.password;
      mockUsersRepository.findOne.mockReturnValue(null);

      await expect(service.login(username, password)).rejects.toThrowError();
      expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should receive an username, an invalid password and throw an Error', async () => {
      const username = mockUser.email;
      const password = 'invalid-password';

      await expect(service.login(username, password)).rejects.toThrowError();
    });
  });

  describe('register', () => {
    let mockUser: User;

    beforeEach(async () => {
      mockUser = new User();
      mockUser.id = faker.datatype.uuid();
      mockUser.firstName = faker.name.firstName();
      mockUser.lastName = faker.name.lastName();
      mockUser.email = faker.internet.email();
      mockUser.password = '12345678';
      await mockUser.encryptPassword();
    });

    it('should receive an user data and return a new User and JWT Token', async () => {
      const data: UserCreateInput = {
        email: mockUser.email,
        password: '12345678',
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
      };
      mockJwtService.sign.mockReturnValue('jwttoken');
      mockUsersRepository.findOne.mockReturnValue(null);
      mockUsersRepository.save.mockReturnValue(mockUser);

      const { user, token } = await service.register(data);

      expect(user).toBeDefined();
      expect(token).toBeDefined();
      expect(mockJwtService.sign).toHaveBeenCalledTimes(1);
      expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockUsersRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should receive an existing email, a password and throw an Error', async () => {
      const data: UserCreateInput = {
        email: mockUser.email,
        password: '12345678',
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
      };
      mockUsersRepository.findOne.mockReturnValue(mockUser);

      await expect(service.register(data)).rejects.toThrowError();
      expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
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

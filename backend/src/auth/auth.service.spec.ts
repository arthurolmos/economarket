import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as faker from 'faker';

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

  describe('validateUser', () => {
    let mockUser: User;

    beforeEach(async () => {
      mockUser = new User();
      mockUser.id = faker.datatype.uuid();
      mockUser.email = faker.internet.email();
      mockUser.password = '12345678';
      await mockUser.encryptPassword();
    });

    it('should receive a valid username and password, and return the User', async () => {
      const username = mockUser.email;
      const password = '12345678';
      mockUsersRepository.findOne.mockReturnValue(mockUser);

      const user = await service.validateUser(username, password);

      expect(user).toBeDefined();
      expect(user).toEqual(mockUser);
      expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should receive a valid username and an invalid password, and return null', async () => {
      const username = mockUser.email;
      const password = 'wrongpassword';
      mockUsersRepository.findOne.mockReturnValue(mockUser);

      const user = await service.validateUser(username, password);

      expect(user).toBe(null);
      expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should receive an invalid username, and throw an Error', async () => {
      const username = 'wrongemail@gmail.com';
      const password = '12345678';
      mockUsersRepository.findOne.mockReturnValue(null);

      await expect(
        service.validateUser(username, password),
      ).rejects.toThrowError();
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

    it('should receive an User and return a JWT Token', async () => {
      const user = mockUser;
      const token = await service.login(user);
      mockJwtService.sign.mockReturnValue('jwttoken');

      expect(token).toBeDefined();
    });
  });
});

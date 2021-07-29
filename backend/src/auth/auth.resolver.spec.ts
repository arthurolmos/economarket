import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as faker from 'faker';
import { UserCreateInput } from 'src/users/inputs/user-create.input';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  const mockUsersRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    restore: jest.fn(),
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
        AuthResolver,
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

    resolver = module.get<AuthResolver>(AuthResolver);

    jest.clearAllMocks();
  });

  describe('login', () => {
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

    it('should login an User', async () => {
      mockUsersRepository.findOne.mockReturnValue(mockUser);
      const { token, user } = await resolver.login(mockUser.email, '12345678');

      expect(token).toBeDefined();
      expect(user).toBeDefined();
      expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
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

    it('should register a new User', async () => {
      const data: UserCreateInput = {
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        password: '12345678',
      };
      mockUsersRepository.findOne.mockReturnValue(null);
      mockUsersRepository.save.mockReturnValue(mockUser);

      const { user, token } = await resolver.register(data);

      expect(user).toBeDefined();
      expect(token).toBeDefined();
      expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockUsersRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});

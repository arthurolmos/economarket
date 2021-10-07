import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserCreateInput } from '../users/inputs/user-create.input';
import { MockRepository, MockUser } from '../../test/mocks';
import * as faker from 'faker';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  const mockUsersRepository = new MockRepository();

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
    let password: string;

    beforeEach(async () => {
      mockUser = new MockUser();
      password = mockUser.password;
      await mockUser.encryptPassword();
    });

    it('should login an User', async () => {
      mockUsersRepository.findOne.mockReturnValue(mockUser);
      const { token, user } = await resolver.login(mockUser.email, password);

      expect(token).toBeDefined();
      expect(user).toBeDefined();
      expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('register', () => {
    let mockUser: User;
    let mockData: UserCreateInput;

    beforeEach(async () => {
      mockData = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: '12345678',
      };

      mockUser = new MockUser(
        mockData.firstName,
        mockData.lastName,
        mockData.email,
        mockData.password,
      );
      await mockUser.encryptPassword();
    });

    it('should register a new User', async () => {
      mockUsersRepository.findOne.mockReturnValue(null);
      mockUsersRepository.save.mockReturnValue(mockUser);

      const { user, token } = await resolver.register(mockData);

      expect(user).toBeDefined();
      expect(token).toBeDefined();
      expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockUsersRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});

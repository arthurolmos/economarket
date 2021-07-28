import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as faker from 'faker';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let service: AuthService;

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
    service = module.get<AuthService>(AuthService);

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
      const token = await resolver.login(mockUser.email, '12345678');

      expect(token).toBeDefined();
    });
  });
});

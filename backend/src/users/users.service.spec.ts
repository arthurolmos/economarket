import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as faker from 'faker';
import { UserCreateInput } from './inputs/user-create.input';
import { UserUpdateInput } from './inputs/user-update.input';

describe('UsersService', () => {
  let service: UsersService;
  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('Find All', () => {
    const mockUsers: User[] = [];

    beforeAll(() => {
      for (let i = 0; i < 5; i++) {
        const user = new User();
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.email = faker.internet.email();

        mockUsers.push(user);
      }
    });

    it('should find all Users ', async () => {
      mockRepository.find.mockReturnValue(mockUsers);

      const users = await service.findAll();

      expect(users).toBeDefined();
      expect(users).toHaveLength(5);
    });
  });

  describe('Find One', () => {
    const mockUser = new User();

    beforeAll(() => {
      mockUser.id = faker.datatype.uuid();
      mockUser.firstName = faker.name.firstName();
      mockUser.lastName = faker.name.lastName();
      mockUser.email = faker.internet.email();
    });

    it('should find an User by passing its ID ', async () => {
      const id = mockUser.id;
      mockRepository.findOne.mockReturnValue(mockUser);

      const user = await service.findOne(id);

      expect(user).toBeDefined();
      expect(user).toEqual(mockUser);
    });
  });

  describe('Create User', () => {
    let mockData: UserCreateInput;

    beforeAll(() => {
      mockData = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: '12345678',
      };
    });

    it('should create a new User and returns it', async () => {
      const mockUser = new User();
      mockUser.firstName = mockData.firstName;
      mockUser.lastName = mockData.lastName;
      mockUser.email = mockData.email;
      mockUser.password = mockData.password;
      mockRepository.save.mockReturnValue(mockUser);

      const user = await service.create(mockData);

      expect(user).toBeDefined();
      expect(user).toEqual(mockUser);
    });
  });

  describe('Update User', () => {
    const mockUser = new User();

    beforeAll(() => {
      mockUser.id = faker.datatype.uuid();
      mockUser.firstName = faker.name.firstName();
      mockUser.lastName = faker.name.lastName();
      mockUser.email = faker.internet.email();
      mockUser.password = '12345678';
    });

    it('should update firstname and lastname of an User and returns it', async () => {
      const mockValues: UserUpdateInput = {
        firstName: 'A new firstname',
        lastName: 'A new lastname',
      };
      mockUser.firstName = mockValues.firstName;
      mockUser.lastName = mockValues.lastName;
      mockRepository.findOne.mockReturnValue(mockUser);
      const id = mockUser.id;

      const user = await service.update(id, mockValues);

      expect(user).toBeDefined();
      expect(user.firstName).toEqual(mockValues.firstName);
      expect(user.lastName).toEqual(mockValues.lastName);
    });
  });

  describe('Remove User', () => {
    const mockUser = new User();

    beforeAll(() => {
      mockUser.id = faker.datatype.uuid();
      mockUser.firstName = faker.name.firstName();
      mockUser.lastName = faker.name.lastName();
      mockUser.email = faker.internet.email();
    });

    it('should soft delete an User', async () => {
      const id = mockUser.id;
      mockRepository.softDelete.mockReturnValue(Promise.resolve());

      expect(await service.remove(id)).resolves;
    });
  });

  describe('Restore User', () => {
    const mockUser = new User();

    beforeAll(() => {
      mockUser.id = faker.datatype.uuid();
      mockUser.firstName = faker.name.firstName();
      mockUser.lastName = faker.name.lastName();
      mockUser.email = faker.internet.email();
    });

    it('should restore a soft deleted User', async () => {
      const id = mockUser.id;
      mockRepository.softDelete.mockReturnValue(Promise.resolve());
      mockRepository.restore.mockReturnValue(Promise.resolve());

      expect(await service.remove(id)).resolves;
      expect(await service.restore(id)).resolves;
    });
  });
});

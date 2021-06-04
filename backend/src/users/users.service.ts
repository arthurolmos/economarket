import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCreateInput } from './inputs/user.create.input';
import { UserUpdateInput } from './inputs/user.update.input';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async create(data: UserCreateInput): Promise<User> {
    const user = new User();
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.email = data.email;
    user.password = data.password;

    return await this.usersRepository.save(user);
  }

  async update(id: string, values: UserUpdateInput): Promise<User> {
    const { firstName, lastName } = values;

    await this.usersRepository.update(id, { firstName, lastName });

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.usersRepository.restore(id);
  }
}

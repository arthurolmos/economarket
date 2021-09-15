import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserCreateInput } from './inputs/user-create.input';
import { UserUpdateInput } from './inputs/user-update.input';
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

  findAllById(ids: string[]): Promise<User[]> {
    return this.usersRepository.find({
      where: { id: In(ids) },
      select: ['id'],
    });
  }

  findAllByEmail(emails: string[]): Promise<User[]> {
    return this.usersRepository.find({
      where: { email: In(emails) },
    });
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(data: UserCreateInput): Promise<User> {
    const user = new User();

    Object.assign(user, data);

    return await this.usersRepository.save(user);
  }

  async update(id: string, values: UserUpdateInput): Promise<User> {
    const user = await this.findOne(id);
    if (!user) throw new Error();

    Object.assign(user, values);

    await this.usersRepository.save(user);

    return user;
  }

  async delete(id: string): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.usersRepository.restore(id);
  }
}

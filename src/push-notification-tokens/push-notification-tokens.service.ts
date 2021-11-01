import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { PushNotificationToken } from './push-notification-token.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class PushNotificationTokensService {
  constructor(
    @InjectRepository(PushNotificationToken)
    private pushNoticationsTokensRepository: Repository<PushNotificationToken>,
    private usersService: UsersService,
  ) {}

  findAll(): Promise<PushNotificationToken[]> {
    return this.pushNoticationsTokensRepository.find({
      relations: ['user'],
    });
  }

  findAllByUser(userId: string): Promise<PushNotificationToken[]> {
    return this.pushNoticationsTokensRepository.find({
      where: { user: userId },
      relations: ['user'],
    });
  }

  findAllByToken(token: string): Promise<PushNotificationToken[]> {
    return this.pushNoticationsTokensRepository.find({
      where: { token },
      relations: ['user'],
    });
  }

  findOne(id: string): Promise<PushNotificationToken> {
    return this.pushNoticationsTokensRepository.findOne(id);
  }

  findOneByUser(userId: string, token: string): Promise<PushNotificationToken> {
    return this.pushNoticationsTokensRepository.findOne({
      where: { user: userId, token },
    });
  }

  checkToken(userId: string, token: string): Promise<PushNotificationToken> {
    return this.pushNoticationsTokensRepository.findOne({
      where: { user: userId, token },
      relations: ['user'],
    });
  }

  async create(token: string, userId: string): Promise<PushNotificationToken> {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found!');

    await this.checkToken(userId, token);
    if (!user) throw new NotFoundException('Token not found!');

    const pushNotificationToken = new PushNotificationToken();

    Object.assign(pushNotificationToken, {
      token,
      user,
    });

    return await this.pushNoticationsTokensRepository.save(
      pushNotificationToken,
    );
  }

  async delete(token: string): Promise<void> {
    await this.pushNoticationsTokensRepository.delete({ token });
  }

  async deleteAll(): Promise<void> {
    await this.pushNoticationsTokensRepository.delete({});
  }
}

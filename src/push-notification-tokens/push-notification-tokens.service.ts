import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { PushNotificationToken } from './push-notification-token.entity';

@Injectable()
export class PushNotificationTokensService {
  constructor(
    @InjectRepository(PushNotificationToken)
    private pushNoticationsTokensRepository: Repository<PushNotificationToken>,
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

  async create(token: string, user: User): Promise<PushNotificationToken> {
    const PushNotificationTokens = new PushNotificationToken();

    Object.assign(PushNotificationTokens, {
      token,
    });
    PushNotificationTokens.user = user;

    return await this.pushNoticationsTokensRepository.save(
      PushNotificationTokens,
    );
  }

  async update(user: User, token: string): Promise<PushNotificationToken> {
    //TODO: resolver depois
    const notification = await this.findOne(token);
    if (!notification) throw new Error();

    Object.assign(notification, { token });

    await this.pushNoticationsTokensRepository.save(notification);

    return notification;
  }

  async delete(token: string): Promise<void> {
    await this.pushNoticationsTokensRepository.delete({ token });
  }

  async deleteAll(): Promise<void> {
    await this.pushNoticationsTokensRepository.delete({});
  }
}

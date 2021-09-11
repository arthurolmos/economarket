import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { NotificationsCreateInput } from './inputs/notifications-create.input';
import { Notification } from './notification.entity';
import { NotificationsUpdateInput } from './inputs/notifications-update.input';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  findAll(): Promise<Notification[]> {
    return this.notificationsRepository.find({
      relations: ['user'],
    });
  }

  findAllByUser(userId: string): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { user: userId },
      relations: ['user'],
    });
  }

  findOne(id: string): Promise<Notification> {
    return this.notificationsRepository.findOne(id);
  }

  async create(
    data: NotificationsCreateInput,
    user: User,
  ): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, data);
    notification.user = user;

    return await this.notificationsRepository.save(notification);
  }

  async update(
    id: string,
    values: NotificationsUpdateInput,
  ): Promise<Notification> {
    const notification = await this.findOne(id);
    if (!notification) throw new Error();

    Object.assign(notification, values);

    await this.notificationsRepository.save(notification);

    return notification;
  }

  async remove(id: string): Promise<void> {
    await this.notificationsRepository.delete(id);
  }

  async removeAll(): Promise<void> {
    await this.notificationsRepository.delete({});
  }
}

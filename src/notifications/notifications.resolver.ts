import { Args, Mutation, Resolver, Query, Subscription } from '@nestjs/graphql';
import { UsersService } from '../users/users.service';
import { NotificationsCreateInput } from './inputs/notifications-create.input';
import { Notification } from './notification.entity';
import { NotificationsService } from './notifications.service';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Resolver()
export class NotificationsResolver {
  constructor(
    private notificationsService: NotificationsService,
    private usersService: UsersService,
    // @Inject('PUB_SUB') private pubSub: PubSub,
    @Inject('REDIS_PUB_SUB') private redisPubSub: RedisPubSub,
  ) {}

  @Query(() => [Notification], { name: 'notifications' })
  getNotifications() {
    try {
      return this.notificationsService.findAll();
    } catch (err) {
      console.log('Error on finding all notification', err);
    }
  }

  @Query(() => [Notification], { name: 'notificationsByUser' })
  getNotificationsByUser(@Args('userId') userId: string) {
    try {
      return this.notificationsService.findAllByUser(userId);
    } catch (err) {
      console.log('Error on finding all notification', err);
    }
  }

  @Query(() => Notification, { name: 'notification' })
  async getNotification(@Args('id') id: string) {
    try {
      return this.notificationsService.findOne(id);
    } catch (err) {
      console.log('Error on finding notification', err);
    }
  }

  @Mutation(() => Notification)
  async createNotification(
    @Args('data') data: NotificationsCreateInput,
    @Args('userId') userId: string,
  ) {
    try {
      const user = await this.usersService.findOne(userId);
      if (!user) throw new Error('User not found!');

      const notification = await this.notificationsService.create(data, user);

      this.redisPubSub.publish('notificationCreated', {
        notificationCreated: notification,
      });

      return notification;
    } catch (err) {
      console.log('Error on creating notification', err);
    }
  }

  @Mutation(() => Notification)
  async createShareShoppingListNotification(
    @Args('userId') userId: string,
    @Args('email') email: string,
    @Args('shoppingListId') shoppingListId?: string,
  ) {
    try {
      const owner = await this.usersService.findOne(userId);
      if (!owner) throw new Error('Owner not found!');

      const destinatary = await this.usersService.findOneByEmail(email);
      if (!destinatary) throw new Error('Destinatary not found!');

      const data: NotificationsCreateInput = {
        title: 'Olha só!',
        body: `${owner.firstName} ${owner.lastName} compartilhou uma lista com você!`,
        shoppingListId,
      };

      const notification = await this.notificationsService.create(
        data,
        destinatary,
      );

      this.redisPubSub.publish('notificationCreated', {
        notificationCreated: notification,
      });

      return notification;
    } catch (err) {
      console.log('Error on creating notification', err);
    }
  }

  //   @Mutation(() => Notification)
  //   async updateNotification(
  //     @Args('id') id: string,
  //     @Args('values') values: NotificationsUpdateInput,
  //   ) {
  //     try {
  //       const notification = await this.notificationsService.update(id, values);

  //       return notification;
  //     } catch (err) {
  //       console.log('Error on updating notification', err);
  //     }
  //   }

  @Mutation(() => Notification)
  async readNotification(@Args('id') id: string) {
    try {
      const notification = await this.notificationsService.update(id, {
        read: true,
      });

      return notification;
    } catch (err) {
      console.log('Error on updating notification', err);
    }
  }

  @Mutation(() => String)
  async deleteNotification(@Args('id') id: string) {
    try {
      await this.notificationsService.remove(id);

      return id;
    } catch (err) {
      console.log('Error on deleting notification', err);
    }
  }

  @Mutation(() => String)
  async deleteAllNotifications() {
    try {
      await this.notificationsService.removeAll();

      return 'ok';
    } catch (err) {
      console.log('Error on deleting notification', err);
    }
  }

  @Subscription(() => Notification, {
    filter: (payload, variables) =>
      payload.notificationCreated.user.id === variables.userId,
  })
  notificationCreated(@Args('userId') userId: string) {
    return this.redisPubSub.asyncIterator('notificationCreated');
  }
}

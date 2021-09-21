import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { PushNotificationManagersService } from '../push-notification-managers/push-notification-managers.service';
import { UsersService } from '../users/users.service';
import { NotificationsCreateInput } from './inputs/notifications-create.input';
import { Notification } from './notification.entity';
import { NotificationsService } from './notifications.service';

@Resolver()
export class NotificationsResolver {
  constructor(
    private notificationsService: NotificationsService,
    private usersService: UsersService,
    private pushNotificationManagersService: PushNotificationManagersService,
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
    @Args('email') email: string,
  ) {
    try {
      const destinatary = await this.usersService.findOneByEmail(email);
      if (!destinatary) throw new Error('User not found!');

      const notification = await this.notificationsService.create(
        data,
        destinatary,
      );

      this.pushNotificationManagersService.sendNotification(notification);

      return notification;
    } catch (err) {
      console.log('Error on creating notification', err);
    }
  }

  // @Mutation(() => Notification)
  // async createShareShoppingListNotification(
  //   @Args('userId') userId: string,
  //   @Args('email') email: string,
  //   @Args('shoppingListId') shoppingListId?: string,
  // ) {
  //   try {
  //     const owner = await this.usersService.findOne(userId);
  //     if (!owner) throw new Error('Owner not found!');

  //     const destinatary = await this.usersService.findOneByEmail(email);
  //     if (!destinatary) throw new Error('Destinatary not found!');

  //     const data: NotificationsCreateInput = {
  //       title: 'Olha só!',
  //       body: `${owner.firstName} ${owner.lastName} compartilhou uma lista com você!`,
  //       shoppingListId,
  //     };

  //     const notification = await this.notificationsService.create(
  //       data,
  //       destinatary,
  //     );

  //     return notification;
  //   } catch (err) {
  //     console.log('Error on creating notification', err);
  //   }
  // }

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
      await this.notificationsService.delete(id);

      return id;
    } catch (err) {
      console.log('Error on deleting notification', err);
    }
  }

  @Mutation(() => String)
  async deleteAllNotifications() {
    try {
      await this.notificationsService.deleteAll();

      return 'ok';
    } catch (err) {
      console.log('Error on deleting notification', err);
    }
  }
}

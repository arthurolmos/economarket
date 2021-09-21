import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ExpoPushMessage } from 'expo-server-sdk';
import { PushNotificationTokensService } from '../push-notification-tokens/push-notification-tokens.service';
import { UsersService } from 'src/users/users.service';
import { PushNotificationManagersService } from './push-notification-managers.service';

@Resolver()
export class PushNotificationManagersResolver {
  constructor(
    private pushNotificationManagersService: PushNotificationManagersService,
    private usersService: UsersService,
    private pushNotificationTokensService: PushNotificationTokensService,
  ) {}

  // @Mutation(() => String)
  // async sendNotification(
  //   @Args({ name: 'to', type: () => [String] }) to: string[],
  //   @Args('title') title: string,
  //   @Args('body') body: string,
  //   @Args('data') data?: string,
  // ) {
  //   const message: ExpoPushMessage = {
  //     to,
  //     title,
  //     body,
  //     data: data ? { data } : null,
  //   };

  //   // const pushNotificationToken = await this.pushNotificationTokensService.findOneByUser

  //   await this.pushNotificationManagersService.sendNotification(message);

  //   return title;
  // }

  // @Mutation(() => PushNotificationManager)
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

  //     const data: PushNotificationManagerCreateInput = {
  //       title: 'Olha só!',
  //       body: `${owner.firstName} ${owner.lastName} compartilhou uma lista com você!`,
  //       shoppingListId,
  //     };

  //     const notification = await this.PushNotificationManagersService.create(
  //       data,
  //       destinatary,
  //     );

  //     return notification;
  //   } catch (err) {
  //     console.log('Error on creating notification', err);
  //   }
  // }
}

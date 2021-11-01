import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UsersService } from '../users/users.service';
import { PushNotificationToken } from './push-notification-token.entity';
import { PushNotificationTokensService } from './push-notification-tokens.service';

@Resolver()
export class PushNotificationTokensResolver {
  constructor(
    private pushNotificationTokensService: PushNotificationTokensService,
    private usersService: UsersService,
  ) {}

  @Query(() => [PushNotificationToken], { name: 'pushNotificationTokens' })
  getPushNotificationTokens() {
    try {
      return this.pushNotificationTokensService.findAll();
    } catch (err) {
      console.log('Error on finding all push notification manager', err);
    }
  }

  @Query(() => [PushNotificationToken], {
    name: 'pushNotificationTokensByUser',
  })
  getPushNotificationTokensByUser(@Args('userId') userId: string) {
    try {
      return this.pushNotificationTokensService.findAllByUser(userId);
    } catch (err) {
      console.log('Error on finding all push notification manager', err);
    }
  }

  @Query(() => PushNotificationToken, { name: 'notification' })
  async getPushNotificationToken(@Args('id') id: string) {
    try {
      return this.pushNotificationTokensService.findOne(id);
    } catch (err) {
      console.log('Error on finding push notification manager', err);
    }
  }

  @Mutation(() => PushNotificationToken)
  async createPushNotificationToken(
    @Args('token') token: string,
    @Args('userId') userId: string,
  ) {
    try {
      const pushNotificationToken =
        await this.pushNotificationTokensService.create(token, userId);

      return pushNotificationToken;
    } catch (err) {
      console.log('Error on creating push notification manager', err);
    }
  }

  @Mutation(() => String)
  async deletePushNotificationToken(@Args('token') token: string) {
    try {
      await this.pushNotificationTokensService.delete(token);

      return 'ok';
    } catch (err) {
      console.log('Error on deleting push notification manager', err);
    }
  }

  @Mutation(() => String)
  async deleteAllPushNotificationTokens() {
    try {
      await this.pushNotificationTokensService.deleteAll();

      return 'ok';
    } catch (err) {
      console.log('Error on deleting push notification manager', err);
    }
  }
}

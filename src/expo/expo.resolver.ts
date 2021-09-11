import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ExpoPushMessage } from 'expo-server-sdk';
import { ExpoService } from './expo.service';

@Resolver()
export class ExpoResolver {
  constructor(private expoService: ExpoService) {}

  @Mutation(() => String)
  async sendNotification(
    @Args({ name: 'to', type: () => [String] }) to: string[],
    @Args('title') title: string,
    @Args('body') body: string,
    @Args('data') data?: string,
  ) {
    const message: ExpoPushMessage = {
      to,
      title,
      body,
      data: data ? { data } : null,
    };

    await this.expoService.sendNotifications([message]);

    return title;
  }
}

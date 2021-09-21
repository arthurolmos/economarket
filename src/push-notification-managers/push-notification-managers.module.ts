import { Module } from '@nestjs/common';
import { PushNotificationTokensModule } from 'src/push-notification-tokens/push-notification-tokens.module';
import { UsersModule } from 'src/users/users.module';
import { expo } from './expo.provider';
import { PushNotificationManagersResolver } from './push-notification-managers.resolver';
import { PushNotificationManagersService } from './push-notification-managers.service';

@Module({
  imports: [UsersModule, PushNotificationTokensModule],
  providers: [
    ...expo,
    PushNotificationManagersService,
    PushNotificationManagersResolver,
  ],
  exports: [PushNotificationManagersService],
})
export class PushNotificationManagersModule {}

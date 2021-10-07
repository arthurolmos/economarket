import { Module } from '@nestjs/common';
import { PushNotificationTokensModule } from 'src/push-notification-tokens/push-notification-tokens.module';
import { UsersModule } from 'src/users/users.module';
import { expo } from './expo.provider';
import { PushNotificationManagersService } from './push-notification-managers.service';

@Module({
  imports: [UsersModule, PushNotificationTokensModule],
  providers: [...expo, PushNotificationManagersService],
  exports: [PushNotificationManagersService],
})
export class PushNotificationManagersModule {}

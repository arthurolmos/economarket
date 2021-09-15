import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { expo } from './expo.provider';
import { PushNotificationManagersResolver } from './push-notification-managers.resolver';
import { PushNotificationManagersService } from './push-notification-managers.service';

@Module({
  imports: [UsersModule],
  providers: [
    ...expo,
    PushNotificationManagersService,
    PushNotificationManagersResolver,
  ],
  exports: [...expo],
})
export class PushNotificationManagersModule {}

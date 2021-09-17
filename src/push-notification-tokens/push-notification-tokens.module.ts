import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { PushNotificationToken } from './push-notification-token.entity';
import { PushNotificationTokensResolver } from './push-notification-tokens.resolver';
import { PushNotificationTokensService } from './push-notification-tokens.service';

@Module({
  imports: [TypeOrmModule.forFeature([PushNotificationToken]), UsersModule],
  providers: [PushNotificationTokensService, PushNotificationTokensResolver],
  exports: [PushNotificationTokensService],
})
export class PushNotificationTokensModule {}

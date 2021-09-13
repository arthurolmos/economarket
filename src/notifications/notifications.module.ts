import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Notification } from './notification.entity';
import { NotificationsResolver } from './notifications.resolver';
import { NotificationsService } from './notifications.service';
import { redisSubscription } from './subscription';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), UsersModule],
  providers: [NotificationsService, NotificationsResolver, redisSubscription],
})
export class NotificationsModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ShoppingListsModule } from './shopping-lists/shopping-lists.module';
import { join } from 'path';
import { ListProductsModule } from './list-products/list-products.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { NotificationsModule } from './notifications/notifications.module';
import { PushNotificationTokensModule } from './push-notification-tokens/push-notification-tokens.module';
import { PushNotificationManagersModule } from './push-notification-managers/push-notification-managers.module';
import { CommonModule } from './common/common.module';
import { WebScrapingModule } from './web-scraping/web-scraping.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    UsersModule,
    ShoppingListsModule,
    ListProductsModule,
    ProductsModule,
    AuthModule,
    NotificationsModule,
    PushNotificationTokensModule,
    PushNotificationManagersModule,
    CommonModule,
    WebScrapingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

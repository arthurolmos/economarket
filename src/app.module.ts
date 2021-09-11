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
import { ExpoModule } from './expo/expo.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
      subscriptions: {
        'subscriptions-transport-ws': true,
        'graphql-ws': true,
      },
    }),
    UsersModule,
    ShoppingListsModule,
    ListProductsModule,
    ProductsModule,
    AuthModule,
    NotificationsModule,
    ExpoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

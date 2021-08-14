import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingList } from './shopping-list.entity';
import { ShoppingListsService } from './shopping-lists.service';
import { ShoppingListsResolver } from './shopping-lists.resolver';
import { UsersModule } from '../users/users.module';
import { ListProductsModule } from '../list-products/list-products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShoppingList]),
    forwardRef(() => UsersModule),
    forwardRef(() => ListProductsModule),
  ],
  providers: [ShoppingListsService, ShoppingListsResolver],
  exports: [ShoppingListsService, ShoppingListsResolver],
})
export class ShoppingListsModule {}

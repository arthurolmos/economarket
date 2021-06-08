import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingList } from './shopping-list.entity';
import { ShoppingListService } from './shopping-list.service';
import { ShoppingListResolver } from './shopping-list.resolver';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShoppingList]),
    forwardRef(() => UsersModule),
  ],
  providers: [ShoppingListService, ShoppingListResolver],
  exports: [ShoppingListService, ShoppingListResolver],
})
export class ShoppingListModule {}

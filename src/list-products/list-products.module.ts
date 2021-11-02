import { forwardRef, Module } from '@nestjs/common';
import { ListProductsService } from './list-products.service';
import { ListProductsResolver } from './list-products.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListProduct } from './list-product.entity';
import { ShoppingListsModule } from '../shopping-lists/shopping-lists.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ListProduct]),
    forwardRef(() => ShoppingListsModule),
  ],
  providers: [ListProductsService, ListProductsResolver],
  exports: [ListProductsService, ListProductsResolver],
})
export class ListProductsModule {}

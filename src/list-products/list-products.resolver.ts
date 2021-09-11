import {
  Parent,
  ResolveField,
  Resolver,
  Query,
  Args,
  Mutation,
} from '@nestjs/graphql';
import { ShoppingList } from '../shopping-lists/shopping-list.entity';
import { ShoppingListsService } from '../shopping-lists/shopping-lists.service';
import { ListProductsCreateInput } from './inputs/list-products-create.input';
import { ListProductsUpdateInput } from './inputs/list-products-update.input';
import { ListProduct } from './list-product.entity';
import { ListProductsService } from './list-products.service';

@Resolver(() => ListProduct)
export class ListProductsResolver {
  constructor(
    private listProductsService: ListProductsService,
    private shoppingListsService: ShoppingListsService,
  ) {}

  @ResolveField()
  shoppingList(@Parent() listProduct: ListProduct) {
    const id = listProduct.shoppingList.id;
    return this.shoppingListsService.findOne(id);
  }

  @Query(() => [ListProduct], { name: 'listProducts' })
  getListProducts() {
    try {
      return this.listProductsService.findAll();
    } catch (err) {
      console.log('Error on finding all list item', err);
    }
  }

  @Query(() => [ListProduct], { name: 'listProductsByShoppingList' })
  getListProductsByShoppingList(
    @Args('shoppingListId') shoppingListId: string,
  ) {
    try {
      return this.listProductsService.findAllByShoppingList(shoppingListId);
    } catch (err) {
      console.log('Error on finding all list Products by Shopping List', err);
    }
  }

  @Query(() => ListProduct, { name: 'listProduct' })
  async getListProduct(@Args('id') id: string) {
    try {
      return this.listProductsService.findOne(id);
    } catch (err) {
      console.log('Error on finding shopping list product', err);
    }
  }

  @Query(() => ListProduct, { name: 'listProductByShoppingList' })
  getListProductByShoppingList(
    @Args('shoppingListId') shoppingListId: string,
    @Args('id') id: string,
  ) {
    try {
      return this.listProductsService.findOneByShoppingList(id, shoppingListId);
    } catch (err) {
      console.log('Error on finding one list Products by Shopping List', err);
    }
  }

  @Mutation(() => ListProduct)
  async createListProduct(
    @Args('data') data: ListProductsCreateInput,
    @Args('shoppingListId') shoppingListId: string,
  ) {
    try {
      const shoppingList = await this.shoppingListsService.findOne(
        shoppingListId,
      );
      if (!shoppingList) throw new Error('Shopping List not found!');

      const listProduct = await this.listProductsService.create(
        data,
        shoppingList,
      );

      return listProduct;
    } catch (err) {
      console.log('Error on creating list item', err);
    }
  }

  @Mutation(() => ListProduct)
  async updateListProduct(
    @Args('id') id: string,
    @Args('values') values: ListProductsUpdateInput,
    @Args('shoppingListId') shoppingListId: string,
  ) {
    try {
      const listProduct = await this.listProductsService.update(
        id,
        values,
        shoppingListId,
      );

      return listProduct;
    } catch (err) {
      console.log('Error on updating shopping list product', err);
    }
  }

  @Mutation(() => String)
  async deleteListProduct(
    @Args('id') id: string,
    @Args('shoppingListId') shoppingListId: string,
  ) {
    try {
      await this.listProductsService.remove(id, shoppingListId);

      return id;
    } catch (err) {
      console.log('Error on deleting shopping list product', err);
    }
  }
}

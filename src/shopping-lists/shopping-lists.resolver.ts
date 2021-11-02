import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ShoppingList } from './shopping-list.entity';
import { ShoppingListsService } from './shopping-lists.service';
import { ShoppingListsCreateInput } from './inputs/shopping-lists-create.input';
import { ShoppingListsUpdateInput } from './inputs/shopping-lists-update.input';

@Resolver(() => ShoppingList)
export class ShoppingListsResolver {
  constructor(private shoppingListsService: ShoppingListsService) {}

  @Query(() => [ShoppingList], { name: 'shoppingLists' })
  getShoppingLists() {
    try {
      return this.shoppingListsService.findAll();
    } catch (err) {
      console.log('Error on finding all shopping list', err);
      return err;
    }
  }

  @Query(() => [ShoppingList], { name: 'shoppingListsByUser' })
  getShoppingListsByUser(@Args('userId') userId: string) {
    try {
      return this.shoppingListsService.findAllByUser(userId);
    } catch (err) {
      console.log('Error on finding all shoppingList', err);
      return err;
    }
  }

  @Query(() => ShoppingList, { name: 'shoppingList' })
  async getShoppingList(@Args('id') id: string) {
    try {
      return this.shoppingListsService.findOne(id);
    } catch (err) {
      console.log('Error on finding shopping list', err);
      return err;
    }
  }

  @Query(() => ShoppingList, { name: 'shoppingListByUser' })
  getShoppingListByUser(
    @Args('id') id: string,
    @Args('userId') userId: string,
  ) {
    try {
      return this.shoppingListsService.findOneByUser(id, userId);
    } catch (err) {
      console.log('Error on finding shopping list', err);
      return err;
    }
  }

  @Mutation(() => ShoppingList)
  async createShoppingList(
    @Args('data') data: ShoppingListsCreateInput,
    @Args('userId') userId: string,
  ) {
    try {
      const shoppingList = await this.shoppingListsService.create(data, userId);

      return shoppingList;
    } catch (err) {
      console.log('Error on creating shopping list', err);
      return err;
    }
  }

  @Mutation(() => ShoppingList)
  async updateShoppingList(
    @Args('id') id: string,
    @Args('values') values: ShoppingListsUpdateInput,
  ) {
    try {
      const shoppingList = await this.shoppingListsService.update(id, values);

      return shoppingList;
    } catch (err) {
      console.log('Error on updating shopping list', err);
      return err;
    }
  }

  @Mutation(() => ShoppingList)
  async finishShoppingList(@Args('id') id: string) {
    try {
      const shoppingList = await this.shoppingListsService.update(id, {
        done: true,
      });

      return shoppingList;
    } catch (err) {
      console.log('Error on updating shopping list', err);
      return err;
    }
  }

  @Mutation(() => ShoppingList)
  async restoreShoppingList(@Args('id') id: string) {
    try {
      const shoppingList = await this.shoppingListsService.update(id, {
        done: false,
      });

      return shoppingList;
    } catch (err) {
      console.log('Error on updating shopping list', err);
      return err;
    }
  }

  @Mutation(() => ShoppingList)
  async shareShoppingList(
    @Args('id') id: string,
    @Args('userId')
    userId: string,
  ) {
    try {
      const shoppingList =
        await this.shoppingListsService.addSharedUsersToShoppingList(
          id,
          userId,
        );

      return shoppingList;
    } catch (err) {
      console.log('Error on adding shared users from shopping list', err);
      return err;
    }
  }

  @Mutation(() => ShoppingList)
  async unshareShoppingList(
    @Args('id') id: string,
    @Args('userId') userId: string,
  ) {
    try {
      const shoppingList =
        await this.shoppingListsService.deleteSharedUserFromShoppingList(
          id,
          userId,
        );

      return shoppingList;
    } catch (err) {
      console.log('Error on removing shared users from shopping list', err);
      return err;
    }
  }

  @Mutation(() => ShoppingList)
  async leaveSharedShoppingList(
    @Args('id') id: string,
    @Args('userId') userId: string,
  ) {
    try {
      const shoppingList =
        await this.shoppingListsService.deleteSharedUserFromShoppingList(
          id,
          userId,
        );

      return shoppingList;
    } catch (err) {
      console.log('Error on removing shared users from shopping list', err);
      return err;
    }
  }

  @Mutation(() => String)
  async deleteShoppingList(@Args('id') id: string) {
    try {
      await this.shoppingListsService.delete(id);

      return id;
    } catch (err) {
      console.log('Error on deleting shopping list', err);
      return err;
    }
  }

  @Mutation(() => ShoppingList)
  async createShoppingListFromPendingProducts(
    @Args({ name: 'ids', type: () => [String] })
    ids: string[],
    @Args('userId') userId: string,
    @Args({ name: 'remove', type: () => Boolean }) remove = false,
    @Args('data') data: ShoppingListsCreateInput,
  ) {
    try {
      const shoppingList =
        await this.shoppingListsService.createShoppingListFromPendingProducts(
          ids,
          userId,
          data,
          remove,
        );

      return shoppingList;
    } catch (err) {
      console.log('Error on creating shopping list', err);
      return err;
    }
  }

  @Mutation(() => ShoppingList)
  async createShoppingListFromShoppingLists(
    @Args({ name: 'ids', type: () => [String] })
    ids: string[],
    @Args('userId') userId: string,
    @Args('data') data: ShoppingListsCreateInput,
  ) {
    try {
      const shoppingList =
        await this.shoppingListsService.createShoppingListFromShoppingLists(
          ids,
          userId,
          data,
        );

      return shoppingList;
    } catch (err) {
      console.log('Error on creating shopping list', err);
      return err;
    }
  }
}

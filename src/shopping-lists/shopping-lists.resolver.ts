import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ShoppingList } from './shopping-list.entity';
import { ShoppingListsService } from './shopping-lists.service';
import { ShoppingListsCreateInput } from './inputs/shopping-lists-create.input';
import { ShoppingListsUpdateInput } from './inputs/shopping-lists-update.input';
import { ListProductsService } from '../list-products/list-products.service';
import { UsersService } from '../users/users.service';

@Resolver(() => ShoppingList)
export class ShoppingListsResolver {
  constructor(
    private shoppingListsService: ShoppingListsService,
    private listProductsService: ListProductsService,
    private usersService: UsersService,
  ) {}

  @ResolveField()
  user(@Parent() shoppingList: ShoppingList) {
    const id = shoppingList.user.id;
    return this.usersService.findOne(id);
  }

  @ResolveField()
  listProducts(@Parent() shoppingList: ShoppingList) {
    const id = shoppingList.id;
    return this.listProductsService.findAllByShoppingList(id);
  }

  @Query(() => [ShoppingList], { name: 'shoppingLists' })
  getShoppingLists() {
    try {
      return this.shoppingListsService.findAll();
    } catch (err) {
      console.log('Error on finding all shopping list', err);
    }
  }

  @Query(() => [ShoppingList], { name: 'shoppingListsByUser' })
  getShoppingListsByUser(@Args('userId') userId: string) {
    try {
      return this.shoppingListsService.findAllByUser(userId);
    } catch (err) {
      console.log('Error on finding all shoppingList', err);
    }
  }

  @Query(() => ShoppingList, { name: 'shoppingList' })
  async getShoppingList(@Args('id') id: string) {
    try {
      return this.shoppingListsService.findOne(id);
    } catch (err) {
      console.log('Error on finding shopping list', err);
    }
  }

  @Query(() => ShoppingList, { name: 'shoppingListByUser' })
  getShoppingListByUser(
    @Args('id') id: string,
    @Args('userId') userId: string,
  ) {
    try {
      return this.shoppingListsService.findOne(id);
      // return this.shoppingListsService.findOneByUser(id, userId);
    } catch (err) {
      console.log('Error on finding shopping list', err);
    }
  }

  @Mutation(() => ShoppingList)
  async createShoppingList(
    @Args('data') data: ShoppingListsCreateInput,
    @Args('userId') userId: string,
  ) {
    try {
      const user = await this.usersService.findOne(userId);
      if (!user) throw new Error('User not found!');

      const shoppingList = await this.shoppingListsService.create(data, user);

      return shoppingList;
    } catch (err) {
      console.log('Error on creating shopping list', err);
    }
  }

  @Mutation(() => ShoppingList)
  async updateShoppingList(
    @Args('id') id: string,
    @Args('values') values: ShoppingListsUpdateInput,
    @Args('userId') userId: string,
  ) {
    try {
      const shoppingList = await this.shoppingListsService.update(
        id,
        values,
        userId,
      );

      return shoppingList;
    } catch (err) {
      console.log('Error on updating shopping list', err);
    }
  }

  @Mutation(() => ShoppingList)
  async finishShoppingList(
    @Args('id') id: string,
    @Args('userId') userId: string,
  ) {
    try {
      const shoppingList = await this.shoppingListsService.update(
        id,
        { done: true },
        userId,
      );

      return shoppingList;
    } catch (err) {
      console.log('Error on updating shopping list', err);
    }
  }

  @Mutation(() => ShoppingList)
  async shareShoppingList(
    @Args('id') id: string,
    @Args('sharedUserId')
    sharedUserId: string,
  ) {
    try {
      const user = await this.usersService.findOne(sharedUserId);
      if (!user) throw new Error();

      const shoppingList =
        await this.shoppingListsService.addSharedUsersToShoppingList(id, user);

      return shoppingList;
    } catch (err) {
      console.log('Error on adding shared users from shopping list', err);
    }
  }

  @Mutation(() => ShoppingList)
  async unshareShoppingList(
    @Args('id') id: string,
    @Args('userId') userId: string,
  ) {
    try {
      const user = await this.usersService.findOne(userId);
      if (!user) throw new Error();

      const shoppingList =
        await this.shoppingListsService.deleteSharedUserFromShoppingList(
          id,
          user,
        );

      return shoppingList;
    } catch (err) {
      console.log('Error on removing shared users from shopping list', err);
    }
  }

  @Mutation(() => ShoppingList)
  async leaveSharedShoppingList(
    @Args('id') id: string,
    @Args('userId') userId: string,
  ) {
    try {
      const user = await this.usersService.findOne(userId);
      if (!user) throw new Error();

      const shoppingList =
        await this.shoppingListsService.deleteSharedUserFromShoppingList(
          id,
          user,
        );

      return shoppingList;
    } catch (err) {
      console.log('Error on removing shared users from shopping list', err);
    }
  }

  @Mutation(() => String)
  async deleteShoppingList(
    @Args('id') id: string,
    @Args('userId') userId: string,
  ) {
    try {
      const shoppingList = await this.shoppingListsService.findOneByUser(
        id,
        userId,
      );
      if (!shoppingList) throw new Error();

      await this.shoppingListsService.delete(id);

      return id;
    } catch (err) {
      console.log('Error on deleting shopping list', err);
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
    }
  }
}

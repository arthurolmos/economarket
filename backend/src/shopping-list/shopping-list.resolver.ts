import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ShoppingList } from './shopping-list.entity';
import { ShoppingListService } from './shopping-list.service';
import { ShoppingListCreateInput } from './inputs/shopping-list-create.input';
import { ShoppingListUpdateInput } from './inputs/shopping-list-update.input';
import { UsersService } from '../users/users.service';

@Resolver(() => ShoppingList)
export class ShoppingListResolver {
  constructor(
    private shoppingListService: ShoppingListService,
    private usersService: UsersService,
  ) {}

  @ResolveField()
  user(@Parent() shoppingList: ShoppingList) {
    const id = shoppingList.user.id;
    return this.usersService.findOne(id);
  }

  @Query(() => [ShoppingList], { name: 'shoppingLists' })
  getShoppingLists() {
    try {
      return this.shoppingListService.findAll();
    } catch (err) {
      console.log('Error on finding all shoppingList', err);
    }
  }

  @Query(() => ShoppingList, { name: 'shoppingList' })
  async getShoppingList(@Args('id') id: string) {
    try {
      return this.shoppingListService.findOne(id);
    } catch (err) {
      console.log('Error on finding shopping list', err);
    }
  }

  @Mutation(() => ShoppingList)
  async createShoppingList(
    @Args('data') data: ShoppingListCreateInput,
    @Args('userId') userId: string,
  ) {
    try {
      const user = await this.usersService.findOne(userId);
      if (!user) throw new Error('User not found!');

      const shoppingList = await this.shoppingListService.create(data, user);

      return shoppingList;
    } catch (err) {
      console.log('Error on creating shopping list', err);
    }
  }

  @Mutation(() => ShoppingList)
  async updateShoppingList(
    @Args('id') id: string,
    @Args('values') values: ShoppingListUpdateInput,
    @Args('userId') userId: string,
  ) {
    try {
      // let shoppingList = await this.usersService.find
      const shoppingList = await this.shoppingListService.update(id, values);

      return shoppingList;
    } catch (err) {
      console.log('Error on updating shopping list', err);
    }
  }

  @Mutation(() => String)
  async deleteShoppingList(@Args('id') id: string) {
    try {
      await this.shoppingListService.remove(id);

      return id;
    } catch (err) {
      console.log('Error on deleting shopping list', err);
    }
  }

  @Mutation(() => String)
  async restoreShoppingList(@Args('id') id: string) {
    try {
      await this.shoppingListService.restore(id);

      return id;
    } catch (err) {
      console.log('Error on restoring shopping list', err);
    }
  }
}

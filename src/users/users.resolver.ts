import { Query, Mutation, Args, Resolver } from '@nestjs/graphql';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UserCreateInput } from './inputs/user-create.input';
import { UserUpdateInput } from './inputs/user-update.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  async getUsers() {
    try {
      return this.usersService.findAll();
    } catch (err) {
      console.log('Error on finding all users', err);
      return err;
    }
  }

  @Query(() => User, { name: 'user' })
  async getUser(@Args('id') id: string) {
    try {
      return this.usersService.findOne(id);
    } catch (err) {
      console.log('Error on finding user', err);
      return err;
    }
  }

  @Mutation(() => User)
  async createUser(@Args('data') data: UserCreateInput) {
    try {
      const user = await this.usersService.create(data);

      return user;
    } catch (err) {
      console.log('Error on creating user', err);
      return err;
    }
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id') id: string,
    @Args('values') values: UserUpdateInput,
  ) {
    try {
      const user = await this.usersService.update(id, values);

      return user;
    } catch (err) {
      console.log('Error on updating user', err);
      return err;
    }
  }

  @Mutation(() => String)
  async deleteUser(@Args('id') id: string) {
    try {
      await this.usersService.delete(id);

      return id;
    } catch (err) {
      console.log('Error on deleting user', err);
      return err;
    }
  }

  @Mutation(() => String)
  async restoreUser(@Args('id') id: string) {
    try {
      await this.usersService.restore(id);

      return id;
    } catch (err) {
      console.log('Error on restoring user', err);
      return err;
    }
  }
}

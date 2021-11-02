import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserCreateInput } from '../users/inputs/user-create.input';
import { User } from '../users/user.entity';
import { AuthResult } from './outputs/auth-result.model';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { GqlAuthGuard } from './guards/gql-jwt-auth.guard';
import { WhoAmI } from './inputs/whoami.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResult)
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    try {
      return this.authService.validateUser(username, password);
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  @Mutation(() => AuthResult)
  register(@Args('data') data: UserCreateInput) {
    try {
      return this.authService.register(data);
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  whoAmI(@CurrentUser() user: WhoAmI) {
    return this.authService.getUserById(user.userId);
  }
}

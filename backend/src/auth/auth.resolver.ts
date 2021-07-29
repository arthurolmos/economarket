import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserCreateInput } from '../users/inputs/user-create.input';
import { User } from '../users/user.entity';
import { AuthResult } from './auth-result.model';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { GqlAuthGuard } from './guards/gql-jwt-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResult)
  login(@Args('username') username: string, @Args('password') password: string) {
    return this.authService.login(username, password);
  }

  @Mutation(() => AuthResult)
  register(@Args('data') data: UserCreateInput) {
    return this.authService.register(data);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return this.authService.getUserById(user.id);
  }
}

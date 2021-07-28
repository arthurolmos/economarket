import { Controller } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => String)
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    return this.authService.login(username, password);
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
// import { TokenAllowListService } from './token-lists/token-allow-list.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService, // private allowListService: TokenAllowListService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(username);
    if (!user) throw new Error('User not found!');

    const match = await user.validatePassword(pass);
    return match ? user : null;
  }

  async login(user: User) {
    const payload = { username: user.email, sub: user.id };

    const token = this.jwtService.sign(payload);

    // await this.allowListService.add(token, user.id);

    return {
      access_token: token,
    };
  }
}

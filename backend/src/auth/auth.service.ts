import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(username);
    if (!user) throw new Error('User not found!');

    const match = await user.validatePassword(password);
    return match ? user : null;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { username: user.email, sub: user.id };

    const token = this.jwtService.sign(payload);

    // await this.allowListService.add(token, user.id);

    return token;
  }
}

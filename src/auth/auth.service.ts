import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { UserCreateInput } from '../users/inputs/user-create.input';
import { UsersService } from '../users/users.service';
// import { TokenAllowListService } from './token-lists/token-allow-list.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService, // private allowListService: TokenAllowListService,
  ) {}

  async getUserById(id: string) {
    const user = await this.usersService.findOne(id);
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    return user;
  }

  async validateUser(username: string, password: string) {
    const user = await this.getUserByEmail(username);
    if (!user) throw new NotFoundException('User not found!');

    const match = await user.validatePassword(password);
    if (match) {
      return this.login(user);
    } else {
      throw new UnauthorizedException();
    }
  }

  async login(user: User) {
    const payload = { username: user.email, sub: user.id };

    const token = this.generateJWTToken(payload);

    // await this.allowListService.add(token, user.id);

    return { user, token };
  }

  async register(data: UserCreateInput) {
    const exists = await this.getUserByEmail(data.email);
    if (exists) throw new Error('Email already registered!');

    const user = await this.usersService.create(data);

    // await this.allowListService.add(token, user.id);

    return this.login(user);
  }

  generateJWTToken({ username, sub }: { username: string; sub: string }) {
    const payload = { username, sub };

    const token = this.jwtService.sign(payload);

    return token;
  }
}

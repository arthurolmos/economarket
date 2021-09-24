import { ObjectType } from '@nestjs/graphql';
import { User } from '../../users/user.entity';

@ObjectType()
export class AuthResult {
  user: User;

  token: string;
}

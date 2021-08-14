import { InputType } from '@nestjs/graphql';

@InputType()
export class UserCreateInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

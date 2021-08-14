import { InputType } from '@nestjs/graphql';

@InputType()
export class UserUpdateInput {
  firstName?: string;
  lastName?: string;
}

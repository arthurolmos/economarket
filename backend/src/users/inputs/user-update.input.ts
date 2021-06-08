import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UserUpdateInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;
}

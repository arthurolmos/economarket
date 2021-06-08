import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UserCreateInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

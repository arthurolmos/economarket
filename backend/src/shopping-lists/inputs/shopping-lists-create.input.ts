import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ShoppingListsCreateInput {
  @Field()
  name?: string;

  @Field()
  date: Date;
}

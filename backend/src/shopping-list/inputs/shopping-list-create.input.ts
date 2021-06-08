import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ShoppingListCreateInput {
  @Field()
  name?: string;

  @Field()
  date: Date;
}

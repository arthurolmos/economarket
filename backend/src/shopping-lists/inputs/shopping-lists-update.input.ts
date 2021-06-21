import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ShoppingListsUpdateInput {
  @Field()
  name: string;

  @Field()
  date: Date;

  @Field()
  done: boolean;
}

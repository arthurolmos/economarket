import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ShoppingListUpdateInput {
  @Field()
  name?: string;

  @Field()
  date?: Date;

  @Field()
  done?: boolean;
}

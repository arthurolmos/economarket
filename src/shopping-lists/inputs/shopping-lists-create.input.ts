import { InputType } from '@nestjs/graphql';

@InputType()
export class ShoppingListsCreateInput {
  name?: string;
  date: Date;
}

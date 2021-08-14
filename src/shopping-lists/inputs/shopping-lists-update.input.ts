import { InputType } from '@nestjs/graphql';
import { ListProductsCreateInput } from '../../list-products/inputs/list-products-create.input';

@InputType()
export class ShoppingListsUpdateInput {
  name?: string;
  date?: Date;
  done?: boolean;
  listProducts?: ListProductsCreateInput;
}

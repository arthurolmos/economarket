import { InputType } from '@nestjs/graphql';

@InputType()
export class ProductsUpdateInput {
  name?: string;
  price?: number;
  market?: string;
  brand?: string;
}

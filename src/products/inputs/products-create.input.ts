import { InputType } from '@nestjs/graphql';

@InputType()
export class ProductsCreateInput {
  name: string;
  price: number;
  market?: string;
  brand?: string;
}

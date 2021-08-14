import { InputType } from '@nestjs/graphql';

@InputType()
export class ListProductsUpdateInput {
  name?: string;
  price?: number;
  quantity?: number;
  purchased?: boolean;
  brand?: string;
  market?: string;
}

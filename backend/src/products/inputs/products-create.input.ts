import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ProductsCreateInput {
  @Field()
  name: string;

  @Field()
  price: number;

  @Field()
  market?: string;

  @Field()
  brand?: string;
}

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductsCreateInput } from './inputs/products-create.input';
import { ProductsUpdateInput } from './inputs/products-update.input';
import { Product } from './product.entity';
import { ProductsService } from './products.service';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private productsService: ProductsService) {}

  @Query(() => [Product], { name: 'products' })
  getProducts() {
    try {
      return this.productsService.findAll();
    } catch (err) {
      console.log('Error on finding all product', err);
    }
  }

  @Query(() => Product, { name: 'product' })
  async getProduct(@Args('id') id: string) {
    try {
      return this.productsService.findOne(id);
    } catch (err) {
      console.log('Error on finding product', err);
    }
  }

  @Mutation(() => Product)
  async createProduct(@Args('data') data: ProductsCreateInput) {
    try {
      const product = await this.productsService.create(data);

      return product;
    } catch (err) {
      console.log('Error on creating product', err);
    }
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('id') id: string,
    @Args('values') values: ProductsUpdateInput,
  ) {
    try {
      const product = await this.productsService.update(id, values);

      return product;
    } catch (err) {
      console.log('Error on updating product', err);
    }
  }

  @Mutation(() => String)
  async deleteProduct(@Args('id') id: string) {
    try {
      await this.productsService.remove(id);

      return id;
    } catch (err) {
      console.log('Error on deleting product', err);
    }
  }

}

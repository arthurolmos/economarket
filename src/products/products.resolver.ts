import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from '../users/users.service';
import { ProductsCreateInput } from './inputs/products-create.input';
import { ProductsUpdateInput } from './inputs/products-update.input';
import { Product } from './product.entity';
import { ProductsService } from './products.service';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(
    private productsService: ProductsService,
    private usersService: UsersService,
  ) {}

  @Query(() => [Product], { name: 'products' })
  getProducts() {
    try {
      return this.productsService.findAll();
    } catch (err) {
      console.log('Error on finding all product', err);
    }
  }

  @Query(() => [Product], { name: 'productsByUser' })
  getProductsByUser(@Args('userId') userId: string) {
    try {
      return this.productsService.findAllByUser(userId);
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
  async createProduct(
    @Args('data') data: ProductsCreateInput,
    @Args('userId') userId: string,
  ) {
    try {
      const user = await this.usersService.findOne(userId);
      if (!user) throw new Error('User not found!');

      const product = await this.productsService.create(data, user);

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

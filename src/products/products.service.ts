import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { ProductsCreateInput } from './inputs/products-create.input';
import { ProductsUpdateInput } from './inputs/products-update.input';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  findAllByUser(userId: string): Promise<Product[]> {
    return this.productsRepository.find({ where: { user: userId } });
  }

  findOne(id: string): Promise<Product> {
    return this.productsRepository.findOne(id);
  }

  async create(data: ProductsCreateInput, user: User): Promise<Product> {
    const product = new Product();

    Object.assign(product, data);
    product.user = user;

    return await this.productsRepository.save(product);
  }

  async update(id: string, values: ProductsUpdateInput): Promise<Product> {
    const product = await this.findOne(id);
    if (!product) throw new Error();

    Object.assign(values);

    await this.productsRepository.save(product);

    return product;
  }

  async delete(id: string): Promise<void> {
    await this.productsRepository.delete(id);
  }
}

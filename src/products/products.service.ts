import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsCreateInput } from './inputs/products-create.input';
import { ProductsUpdateInput } from './inputs/products-update.input';
import { Product } from './product.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private usersService: UsersService,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      order: { name: 'ASC' },
    });
  }

  findAllByUser(userId: string): Promise<Product[]> {
    return this.productsRepository.find({
      where: { user: userId },
      order: { name: 'ASC' },
    });
  }

  findOne(id: string): Promise<Product> {
    return this.productsRepository.findOne(id);
  }

  async create(data: ProductsCreateInput, userId: string): Promise<Product> {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new Error('User not found!');

    const product = new Product();

    Object.assign(product, data, { user });

    return await this.productsRepository.save(product);
  }

  async update(id: string, values: ProductsUpdateInput): Promise<Product> {
    const product = await this.findOne(id);
    if (!product) throw new Error();

    Object.assign(product, values);

    await this.productsRepository.save(product);

    return product;
  }

  async delete(id: string): Promise<void> {
    await this.productsRepository.delete(id);
  }
}

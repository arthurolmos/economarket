import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  findOne(id: string): Promise<Product> {
    return this.productsRepository.findOne(id);
  }

  async create(data: ProductsCreateInput): Promise<Product> {
    const product = new Product();
    product.name = data.name;
    product.price = data.price;
    product.market = data.market && data.market;
    product.brand = data.brand && data.brand;

    return await this.productsRepository.save(product);
  }

  async update(id: string, values: ProductsUpdateInput): Promise<Product> {
    const { name, price, market, brand } = values;

    await this.productsRepository.update(id, { name, price, market, brand });

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.productsRepository.delete(id);
  }
}

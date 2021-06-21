import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingList } from 'src/shopping-lists/shopping-list.entity';
import { Repository } from 'typeorm';
import { ListProductsCreateInput } from './inputs/list-products-create.input';
import { ListProductsUpdateInput } from './inputs/list-products-update.input';
import { ListProduct } from './list-product.entity';

@Injectable()
export class ListProductsService {
  constructor(
    @InjectRepository(ListProduct)
    private listProductsRepository: Repository<ListProduct>,
  ) {}

  findAll(): Promise<ListProduct[]> {
    return this.listProductsRepository.find({ relations: ['shoppingList'] });
  }

  findAllByShoppingList(shoppingListId: string): Promise<ListProduct[]> {
    return this.listProductsRepository.find({
      where: { shoppingListId },
      relations: ['shoppingLists'],
    });
  }

  // findAllByUser(shoppingListId: string[]): Promise<ListProduct[]> {
  //   return this.listProductsRepository.find({
  //     where: { shoppingListId: shoppingListId },
  //     relations: ['shoppingLists'],
  //   });
  // }

  findOne(id: string): Promise<ListProduct> {
    return this.listProductsRepository.findOne(id);
  }

  findOneByShoppingList(
    id: string,
    shoppingListId: string,
  ): Promise<ListProduct> {
    return this.listProductsRepository.findOne({
      where: { id, shoppingList: shoppingListId },
    });
  }

  async create(
    data: ListProductsCreateInput,
    shoppingList: ShoppingList,
  ): Promise<ListProduct> {
    const listProduct = new ListProduct();
    listProduct.name = data.name;
    listProduct.price = data.price;
    listProduct.quantity = data.quantity;
    listProduct.purchased = data.purchased;
    listProduct.brand = data.brand && data.brand;
    listProduct.market = data.market && data.market;
    listProduct.shoppingList = shoppingList;

    return await this.listProductsRepository.save(listProduct);
  }

  async update(
    id: string,
    values: ListProductsUpdateInput,
  ): Promise<ListProduct> {
    const { name, price, quantity, purchased, brand, market } = values;

    await this.listProductsRepository.update(id, {
      name,
      price,
      quantity,
      purchased,
      brand,
      market,
    });

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.listProductsRepository.delete(id);
  }
}

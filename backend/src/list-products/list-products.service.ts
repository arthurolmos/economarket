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
    return this.listProductsRepository.find({
      relations: ['shoppingList'],
    });
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

    Object.assign(listProduct, data);
    listProduct.shoppingList = shoppingList;

    return await this.listProductsRepository.save(listProduct);
  }

  async update(
    id: string,
    values: ListProductsUpdateInput,
    shoppingListId: string,
  ): Promise<ListProduct> {
    const listProduct = await this.findOneByShoppingList(id, shoppingListId);
    if (!listProduct) throw new Error();

    Object.assign(listProduct, values);

    await this.listProductsRepository.save(listProduct);

    return listProduct;
  }

  async remove(id: string, shoppingListId: string): Promise<void> {
    const listProduct = await this.findOneByShoppingList(id, shoppingListId);
    if (!listProduct) throw new Error();

    await this.listProductsRepository.delete(id);
  }
}

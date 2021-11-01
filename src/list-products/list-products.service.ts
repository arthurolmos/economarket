import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ListProductsCreateInput } from './inputs/list-products-create.input';
import { ListProductsUpdateInput } from './inputs/list-products-update.input';
import { ListProduct } from './list-product.entity';
import { ShoppingListsService } from '../shopping-lists/shopping-lists.service';

@Injectable()
export class ListProductsService {
  constructor(
    @InjectRepository(ListProduct)
    private listProductsRepository: Repository<ListProduct>,
    private shoppingListsService: ShoppingListsService,
  ) {}

  findAll(): Promise<ListProduct[]> {
    return this.listProductsRepository.find({
      relations: ['shoppingList'],
      order: { name: 'ASC' },
    });
  }

  findAllByIds(ids: string[]): Promise<ListProduct[]> {
    return this.listProductsRepository.find({
      where: { id: In(ids) },
      relations: ['shoppingList'],
      order: { name: 'ASC' },
    });
  }

  findAllByShoppingList(shoppingListId: string): Promise<ListProduct[]> {
    return this.listProductsRepository.find({
      where: { shoppingList: shoppingListId },
      relations: ['shoppingList'],
      order: { name: 'ASC' },
    });
  }

  findAllPendingByShoppingLists(
    shoppingListIds: string[],
  ): Promise<ListProduct[]> {
    return this.listProductsRepository.find({
      where: { shoppingList: In(shoppingListIds), purchased: false },
      relations: ['shoppingList'],
      order: { name: 'ASC' },
    });
  }

  findOne(id: string): Promise<ListProduct> {
    return this.listProductsRepository.findOne({
      where: id,
      relations: ['shoppingList'],
    });
  }

  findOneByShoppingList(
    id: string,
    shoppingListId: string,
  ): Promise<ListProduct> {
    return this.listProductsRepository.findOne({
      where: { id, shoppingList: shoppingListId },
      relations: ['shoppingList'],
    });
  }

  async create(
    data: ListProductsCreateInput,
    shoppingListId: string,
  ): Promise<ListProduct> {
    const shoppingList = await this.shoppingListsService.findOne(
      shoppingListId,
    );
    if (!shoppingList) throw new Error('Shopping List not found!');

    const listProduct = new ListProduct();

    Object.assign(listProduct, data, { shoppingList });

    return await this.listProductsRepository.save(listProduct);
  }

  async update(
    id: string,
    values: ListProductsUpdateInput,
    shoppingListId: string,
  ): Promise<ListProduct> {
    const listProduct = await this.findOneByShoppingList(id, shoppingListId);
    if (!listProduct) throw new Error('List Product not found!');

    Object.assign(listProduct, values);

    await this.listProductsRepository.save(listProduct);

    return listProduct;
  }

  async delete(id: string, shoppingListId: string): Promise<void> {
    const listProduct = await this.findOneByShoppingList(id, shoppingListId);
    if (!listProduct) throw new Error();

    await this.listProductsRepository.delete(id);
  }

  async removeMany(ids: string[]): Promise<void> {
    const listProducts = await this.findAllByIds(ids);

    await this.listProductsRepository.remove(listProducts);
  }
}

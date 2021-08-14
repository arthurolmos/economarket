import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ListProduct } from '../list-products/list-product.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
@ObjectType()
export class ShoppingList {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ nullable: true })
  name?: string;

  @Column('timestamptz')
  date: Date;
  @Column('boolean', { default: false })
  done: boolean;

  @ManyToOne(() => User, (user) => user.shoppingLists, {})
  user: User;

  @ManyToMany(() => User, {
    nullable: true,
  })
  @JoinTable()
  sharedUsers: User[];

  @OneToMany(() => ListProduct, (listProduct) => listProduct.shoppingList, {
    cascade: true,
    nullable: true,
    eager: true,
  })
  listProducts?: ListProduct[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ShoppingList } from '../shopping-lists/shopping-list.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
@ObjectType()
export class ListProduct {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column('decimal')
  price: number;

  @Column({ nullable: true })
  brand?: string;

  @Column({ nullable: true })
  market?: string;

  @Column('boolean', { default: false })
  purchased: boolean;

  @Column({ nullable: true })
  @Field(() => ID)
  productId?: string;

  @ManyToOne(() => ShoppingList, (shoppingList) => shoppingList.listProducts, {
    onDelete: 'CASCADE',
  })
  shoppingList: ShoppingList;

  @OneToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

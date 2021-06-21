import { ObjectType, Field, ID, HideField } from '@nestjs/graphql';
import { ShoppingList } from '../shopping-lists/shopping-list.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  email: string;

  @Column()
  @HideField()
  password: string;

  @OneToMany(() => ShoppingList, (shoppingList) => shoppingList.user, {
    cascade: true,
  })
  shoppingLists?: ShoppingList[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

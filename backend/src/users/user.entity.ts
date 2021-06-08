import { ObjectType, Field, ID, HideField } from '@nestjs/graphql';
import { ShoppingList } from '../shopping-list/shopping-list.entity';
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

  @Column('varchar')
  firstName: string;
  @Column('varchar')
  lastName: string;
  @Column('varchar')
  email: string;

  @Column('varchar')
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

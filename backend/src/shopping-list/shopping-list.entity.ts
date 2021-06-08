import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  Timestamp,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
@ObjectType()
export class ShoppingList {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column('varchar')
  name?: string;

  @Column('timestamptz')
  date: Date;
  @Column('boolean', { default: false })
  done: boolean;

  @ManyToOne(() => User, (user) => user.shoppingLists)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

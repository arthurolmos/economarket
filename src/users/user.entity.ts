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
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

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
  // @HideField()
  password: string;

  @OneToMany(() => ShoppingList, (shoppingList) => shoppingList.user, {
    cascade: true,
    eager: true,
  })
  shoppingLists?: ShoppingList[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  async encryptPassword() {
    const hashedPassword = await bcrypt.hash(this.password, 10);

    this.password = hashedPassword;
  }

  async validatePassword(password: string) {
    const match = await bcrypt.compare(password, this.password);

    return match;
  }
}

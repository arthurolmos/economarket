import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../users/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ default: false })
  read: boolean;

  @ManyToOne(() => User, (user) => user.notifications, {})
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  @Field(() => ID)
  shoppingListId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

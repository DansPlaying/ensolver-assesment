import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
  Unique,
} from 'typeorm';
import { Category } from './category.entity';
import { User } from './user.entity';

@Entity()
@Unique(['title', 'userId'])
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ default: false })
  isArchived: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Category, (category) => category.notes, { eager: true })
  @JoinTable()
  categories: Category[];

  @ManyToOne(() => User, (user) => user.notes, { nullable: false })
  user: User;

  @Column()
  userId: number;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { Note } from './note.entity';
import { User } from './user.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Note, (note) => note.categories)
  notes: Note[];

  @ManyToOne(() => User, (user) => user.categories, { nullable: false })
  user: User;

  @Column()
  userId: number;
}

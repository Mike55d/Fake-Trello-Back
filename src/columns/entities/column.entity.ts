import { Task } from 'src/tasks/entities/task.entity';
import {
  PrimaryGeneratedColumn,
  Column as ColumnType,
  Entity,
  OneToMany,
} from 'typeorm';

@Entity()
export class Column {
  @PrimaryGeneratedColumn()
  id: number;

  @ColumnType()
  title: string;

  @ColumnType()
  order: number;

  @OneToMany(() => Task, (task) => task.column)
  tasks: Task[];
}

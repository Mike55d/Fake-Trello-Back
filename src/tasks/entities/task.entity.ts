import { Column } from 'src/columns/entities/column.entity';
import {
  PrimaryGeneratedColumn,
  Column as ColumnType,
  Entity,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ColumnType()
  title: string;

  @ColumnType()
  subtitle: string;

  @ColumnType()
  text: string;

  @ColumnType()
  order: number;

  @ManyToOne(() => Column, (column) => column.tasks)
  column: Column;
}

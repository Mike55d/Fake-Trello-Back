import { PrimaryGeneratedColumn, Column as ColumnType, Entity } from 'typeorm';

@Entity()
export class Column {
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
}

import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class SortTaskDto {
  @IsNumber()
  @IsNotEmpty()
  taskId: number;

  @IsNumber()
  @IsNotEmpty()
  columnId: number;

  @IsNumber()
  @IsNotEmpty()
  sourceIndex: number;

  @IsNumber()
  @IsNotEmpty()
  destinationIndex: number;
}

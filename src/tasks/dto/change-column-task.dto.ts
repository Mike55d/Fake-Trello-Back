import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class ChangeColumnTaskDto {
  @IsNumber()
  @IsNotEmpty()
  taskId: number;

  @IsNumber()
  @IsNotEmpty()
  columnDestiny: number;

  @IsNumber()
  @IsNotEmpty()
  sourceIndex: number;

  @IsNumber()
  @IsNotEmpty()
  columnId: number;

  @IsNumber()
  @IsNotEmpty()
  destinationIndex: number;
}

import { Injectable } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { Column } from './entities/column.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(Column) private columnRepository: Repository<Column>,
  ) {}

  async create(createColumnDto: CreateColumnDto) {
    const column = this.columnRepository.create(createColumnDto);
    await this.columnRepository.save(column);
    return 'This action adds a new column';
  }

  async findAll() {
    const columns = await this.columnRepository.find({});
    return columns;
  }

  async findOne(id: number) {
    const column = await this.columnRepository.findOneBy({ id });
    return column;
  }

  async update(id: number, updateColumnDto: UpdateColumnDto) {
    const column = await this.columnRepository.findOneBy({ id });
    const newColumn = await this.columnRepository.merge(
      column,
      updateColumnDto,
    );
    await this.columnRepository.save(newColumn);
    return `This action updates a #${id} column`;
  }

  async remove(id: number) {
    const column = await this.columnRepository.findOneBy({ id });
    this.columnRepository.remove(column);
    return `This action removes a #${id} column`;
  }
}

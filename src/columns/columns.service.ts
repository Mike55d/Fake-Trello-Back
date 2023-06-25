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

  findOne(id: number) {
    return `This action returns a #${id} column`;
  }

  update(id: number, updateColumnDto: UpdateColumnDto) {
    return `This action updates a #${id} column`;
  }

  remove(id: number) {
    return `This action removes a #${id} column`;
  }
}

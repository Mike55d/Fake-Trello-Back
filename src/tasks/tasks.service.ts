import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const task = this.taskRepository.create({
      ...createTaskDto,
      column: { id: createTaskDto.columnId },
    });
    await this.taskRepository.save(task);
    return 'This action adds a new task';
  }

  async findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.findOneBy({ id });
    const newTask = this.taskRepository.merge(task, {
      ...updateTaskDto,
      column: { id: updateTaskDto.columnId },
    });
    await this.taskRepository.save(newTask);
    return `This action updates a #${id} task`;
  }

  async remove(id: number) {
    const task = await this.taskRepository.findOneBy({ id });
    this.taskRepository.remove(task);
    return `This action removes a #${id} task`;
  }
}

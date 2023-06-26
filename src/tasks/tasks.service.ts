import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { SortTaskDto } from './dto/sort-task.dto';
import { ChangeColumnTaskDto } from './dto/change-column-task.dto';
import { Column } from 'src/columns/entities/column.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const maxOrder = await this.taskRepository.find({
      order: {
        order: 'DESC',
      },
      take: 1,
    });

    const task = this.taskRepository.create({
      ...createTaskDto,
      column: { id: createTaskDto.columnId },
      order: maxOrder[0].order + 1,
    });
    await this.taskRepository.save(task);
    return 'This action adds a new task';
  }

  async sortTask(sortTaskDto: SortTaskDto) {
    const { sourceIndex, destinationIndex, columnId, taskId } = sortTaskDto;
    const taskDragged = await this.taskRepository.findOneBy({ id: taskId });
    taskDragged.order = destinationIndex;
    await this.taskRepository.save(taskDragged);
    const tasksReorderQuery = this.taskRepository
      .createQueryBuilder('task')
      .where('task.id != :taskId')
      .andWhere('task.columnId = :columnId');
    if (sourceIndex < destinationIndex) {
      tasksReorderQuery
        .andWhere('task.order <= :destinationIndex')
        .andWhere('task.order > :sourceIndex')
        .setParameters({ columnId, destinationIndex, sourceIndex, taskId });
      const taskReorder = await tasksReorderQuery.getMany();
      for (const item of taskReorder) {
        const task = await this.taskRepository.findOneBy({ id: item.id });
        task.order = task.order - 1;
        this.taskRepository.save(task);
      }
    } else {
      tasksReorderQuery
        .andWhere('task.order >= :destinationIndex')
        .andWhere('task.order < :sourceIndex')
        .setParameters({ columnId, destinationIndex, sourceIndex, taskId });
      const taskReorder = await tasksReorderQuery.getMany();
      for (const item of taskReorder) {
        const task = await this.taskRepository.findOneBy({ id: item.id });
        task.order = task.order + 1;
        this.taskRepository.save(task);
      }
    }
    return `tasks reordered`;
  }

  async changeColumn(sortTaskDto: ChangeColumnTaskDto) {
    const { destinationIndex, columnDestiny, taskId, columnId, sourceIndex } =
      sortTaskDto;
    const taskDragged = await this.taskRepository.findOneBy({ id: taskId });
    taskDragged.order = destinationIndex;
    taskDragged.column = Object.assign(new Column(), {
      id: columnDestiny,
    });
    await this.taskRepository.save(taskDragged);
    const tasksReorderOldColumnQuery = this.taskRepository
      .createQueryBuilder('task')
      .andWhere('task.columnId = :columnId')
      .andWhere('task.order > :sourceIndex')
      .setParameters({ columnId, sourceIndex });
    const tasksReorderOldColumn = await tasksReorderOldColumnQuery.getMany();
    for (const item of tasksReorderOldColumn) {
      const task = await this.taskRepository.findOneBy({ id: item.id });
      task.order = task.order - 1;
      this.taskRepository.save(task);
    }
    const tasksReorderNewColumnQuery = this.taskRepository
      .createQueryBuilder('task')
      .where('task.id != :taskId')
      .andWhere('task.columnId = :columnDestiny')
      .andWhere('task.order >= :destinationIndex')
      .setParameters({ columnDestiny, destinationIndex, taskId });
    const taskReorder = await tasksReorderNewColumnQuery.getMany();
    for (const item of taskReorder) {
      const task = await this.taskRepository.findOneBy({ id: item.id });
      task.order = task.order + 1;
      this.taskRepository.save(task);
    }
    return `tasks column changed`;
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
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['column'],
    });
    const tasksReorderNewColumnQuery = this.taskRepository
      .createQueryBuilder('task')
      .where('task.id != :taskId')
      .andWhere('task.columnId = :column')
      .andWhere('task.order > :order')
      .setParameters({
        column: task.column.id,
        order: task.order,
        taskId: task.id,
      });
    const taskReorder = await tasksReorderNewColumnQuery.getMany();
    for (const item of taskReorder) {
      const task = await this.taskRepository.findOneBy({ id: item.id });
      task.order = task.order - 1;
      this.taskRepository.save(task);
    }
    this.taskRepository.remove(task);
    return `This action removes a #${id} task`;
  }
}

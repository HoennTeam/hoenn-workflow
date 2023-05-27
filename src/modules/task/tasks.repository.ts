import { HttpStatus, Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { Task } from '../../entities/task'
import { AppException } from '../../common/exceptions/app.exception'

@Injectable()
export class TasksRepository {
  constructor(private readonly connection: DataSource) {}

  public async getTaskIfExists(id: number): Promise<Task> {
    const task = await this.connection
      .getRepository(Task)
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.stage', 'stage')
      .where('task.id = :id', { id })
      .getOne()

    if (!task) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Task not found', {
        id,
      })
    }

    return task
  }

  public async getFullTaskIfExists(id: number): Promise<Task> {
    const task = await this.connection
      .getRepository(Task)
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.stage', 'stage')
      .leftJoinAndSelect('task.assignees', 'assignees')
      .leftJoinAndSelect('assignees.globalRole', 'globalRole')
      .where('task.id = :id', { id })
      .getOne()

    if (!task) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Task not found', {
        id,
      })
    }

    return task
  }
}

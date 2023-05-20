import { HttpStatus, Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { Config } from '../../core/config'
import { Logger } from '../../core/logger'
import { CreateTaskDto } from './dto/create-task.dto'
import { FullTaskDto } from './dto/full-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { Task } from '../../entities/task'
import { Stage } from '../../entities/stage'
import { AppException } from '../../common/exceptions/app.exception'
import { Board } from '../../entities/board'

@Injectable()
export class TasksService {
  constructor(
    private readonly logger: Logger,
    private readonly config: Config,
    private readonly connection: DataSource
  ) {}

  public async createTask(dto: CreateTaskDto): Promise<FullTaskDto> {
    const board = await this.connection
      .getRepository(Board)
      .findOne({ where: { id: dto.boardId } })

    if (!board) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Board not found', {
        boardId: dto.boardId,
      })
    }

    const stage = await this.connection
      .getRepository(Stage)
      .findOne({ where: { id: dto.stageId } })
    if (!stage) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Stage not found', {
        stageId: dto.stageId,
      })
    }

    const task = new Task({
      board,
      stage,
      title: dto.title,
      description: '',
    })

    const created = await this.connection.getRepository(Task).save(task)

    return {
      id: created.id,
      title: created.title,
      description: created.description,
      stageId: stage.id,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    }
  }

  async removeTask(id: number): Promise<void> {
    const task = await this.connection
      .getRepository(Task)
      .findOne({ where: { id } })

    if (!task) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Task not found', {
        id,
      })
    }

    await this.connection.getRepository(Task).softRemove(task)
  }

  async getFullTask(id: number): Promise<FullTaskDto> {
    const task = await this.connection
      .getRepository(Task)
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.stage', 'stage')
      .getOne()

    if (!task) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Task not found', {
        id,
      })
    }

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      stageId: task.stage.id,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    }
  }

  async updateTask(dto: UpdateTaskDto): Promise<FullTaskDto> {
    const task = await this.connection
      .getRepository(Task)
      .findOne({ where: { id: dto.id }, relations: ['stage'] })

    if (!task) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Task not found', {
        id: dto.id,
      })
    }

    if (dto.title) {
      task.title = dto.title
    }
    if (dto.description) {
      task.description = dto.description
    }
    if (dto.stageId) {
      const stage = await this.connection
        .createQueryBuilder(Stage, 'stage')
        .where('stage.id = :stageId', { stageId: dto.stageId })
        .getOne()

      if (!stage) {
        throw new AppException(HttpStatus.NOT_FOUND, 'Stage not found', {
          id: dto.stageId,
        })
      }

      task.stage = stage
    }

    const created = await this.connection.getRepository(Task).save(task)

    return {
      id: created.id,
      title: created.title,
      description: created.description,
      stageId: task.stage.id,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    }
  }
}

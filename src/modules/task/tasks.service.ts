import { HttpStatus, Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { Config } from '../../core/config'
import { Logger } from '../../core/logger'
import { CreateTaskDto } from './dto/create-task.dto'
import { FullTaskDto } from './dto/full-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { Task } from '../../entities/task'
import { AppException } from '../../common/exceptions/app.exception'
import { ProjectsService } from '../projects/projects.service'
import { MoveTaskDto } from './dto/move-task.dto'

@Injectable()
export class TasksService {
  constructor(
    private readonly logger: Logger,
    private readonly config: Config,
    private readonly connection: DataSource,
    private readonly projectsService: ProjectsService
  ) {}

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

  public getFullTaskDto(task: Task): FullTaskDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      stageId: task.stage.id,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    }
  }

  public async createTask(dto: CreateTaskDto): Promise<FullTaskDto> {
    const board = await this.projectsService.getBoardIfExists(
      dto.projectId,
      dto.boardId
    )
    const stage = await this.projectsService.getStageIfExists(dto.stageId)

    const task = new Task({
      board,
      stage,
      title: dto.title,
      description: '',
    })

    const created = await this.connection.getRepository(Task).save(task)

    return this.getFullTaskDto(created)
  }

  async removeTask(id: number): Promise<void> {
    const task = await this.getTaskIfExists(id)

    await this.connection.getRepository(Task).softRemove(task)
  }

  async getFullTask(id: number): Promise<FullTaskDto> {
    const task = await this.getTaskIfExists(id)

    return this.getFullTaskDto(task)
  }

  async updateTask(dto: UpdateTaskDto): Promise<FullTaskDto> {
    const task = await this.getTaskIfExists(dto.id)

    if (dto.title) {
      task.title = dto.title
    }
    if (dto.description) {
      task.description = dto.description
    }

    const updated = await this.connection.getRepository(Task).save(task)

    return this.getFullTaskDto(updated)
  }

  async moveTask(dto: MoveTaskDto): Promise<FullTaskDto> {
    const task = await this.getTaskIfExists(dto.id)

    if (dto.stageId) {
      const stage = await this.projectsService.getStageIfExists(dto.stageId)

      task.stage = stage
    }

    const updated = await this.connection.getRepository(Task).save(task)

    return this.getFullTaskDto(updated)
  }
}

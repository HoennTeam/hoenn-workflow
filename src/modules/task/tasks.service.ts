import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { Config } from '../../core/config'
import { Logger } from '../../core/logger'
import { CreateTaskDto } from './dto/create-task.dto'
import { FullTaskDto } from './dto/full-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { Task } from '../../entities/task'
import { MoveTaskDto } from './dto/move-task.dto'
import { ProjectsRepository } from '../projects/projects.repository'
import { TasksRepository } from './tasks.repository'

@Injectable()
export class TasksService {
  constructor(
    private readonly logger: Logger,
    private readonly config: Config,
    private readonly connection: DataSource,
    private readonly projectsRepository: ProjectsRepository,
    private readonly tasksRepository: TasksRepository
  ) {}

  public getFullTaskDto(task: Task): FullTaskDto {
    return {
      id: task.id,
      number: task.number,
      title: task.title,
      description: task.description,
      stageId: task.stage.id,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    }
  }

  public async createTask(dto: CreateTaskDto): Promise<FullTaskDto> {
    const board = await this.projectsRepository.getBoardIfExists(
      dto.projectId,
      dto.boardId
    )
    const stage = await this.projectsRepository.getStageIfExists(dto.stageId)

    return await this.connection.transaction(async (tx) => {
      const { taskNumber } = await tx
        .getRepository(Task)
        .createQueryBuilder('task')
        .select('COALESCE(MAX(task.number), 1)', 'taskNumber')
        .leftJoin('task.board', 'board')
        .where('board.project = :projectId', { projectId: dto.projectId })
        .getRawOne()

      const task = new Task({
        board,
        stage,
        number: taskNumber,
        title: dto.title,
        description: '',
      })

      const created = await tx.getRepository(Task).save(task)

      return this.getFullTaskDto(created)
    })
  }

  async removeTask(id: number): Promise<void> {
    const task = await this.tasksRepository.getTaskIfExists(id)

    await this.connection.getRepository(Task).softRemove(task)
  }

  async getFullTask(id: number): Promise<FullTaskDto> {
    const task = await this.tasksRepository.getFullTaskIfExists(id)

    return this.getFullTaskDto(task)
  }

  async updateTask(dto: UpdateTaskDto): Promise<FullTaskDto> {
    const task = await this.tasksRepository.getTaskIfExists(dto.id)

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
    const task = await this.tasksRepository.getTaskIfExists(dto.id)

    if (dto.stageId) {
      const stage = await this.projectsRepository.getStageIfExists(dto.stageId)

      task.stage = stage
    }

    const updated = await this.connection.getRepository(Task).save(task)

    return this.getFullTaskDto(updated)
  }
}

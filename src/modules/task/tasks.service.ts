import { HttpStatus, Injectable } from '@nestjs/common'
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
import { UserTaskDto } from './dto/add-user-task.dto'
import { UsersRepository } from '../users/users.repository'
import { AppException } from '../../common/exceptions/app.exception'

@Injectable()
export class TasksService {
  constructor(
    private readonly logger: Logger,
    private readonly config: Config,
    private readonly connection: DataSource,
    private readonly projectsRepository: ProjectsRepository,
    private readonly tasksRepository: TasksRepository,
    private readonly usersRepository: UsersRepository
  ) {}

  public getFullTaskDto(task: Task): FullTaskDto {
    return {
      id: task.id,
      number: task.number,
      title: task.title,
      description: task.description,
      index: task.index,
      stageId: task.stage.id,
      assignees: task.assignees.map((u) => ({
        username: u.username,
        email: u.email,
        fullName: u.fullName,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
      })),
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
        .select('COALESCE(MAX(task.number) + 1, 1)', 'taskNumber')
        .leftJoin('task.board', 'board')
        .where('board.project = :projectId', { projectId: dto.projectId })
        .getRawOne()

      const { taskIndex } = await tx
        .getRepository(Task)
        .createQueryBuilder('task')
        .select('COALESCE(MAX(task.index) + 1, 1)', 'taskIndex')
        .where('task.stage = :stageId', { stageId: dto.stageId })
        .getRawOne()

      const task = new Task({
        board,
        stage,
        number: taskNumber,
        index: taskIndex,
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

    const fromStageId = task.stage.id

    if (dto.stageId) {
      const stage = await this.projectsRepository.getStageIfExists(dto.stageId)

      task.stage = stage
    }

    const toStageId = task.stage.id
    const oldIndex = task.index

    await this.connection.transaction(async (tx) => {
      // Task should be on top of the list
      if (!dto.leadingTaskId) {
        task.index = 1
      } else {
        const { leadingTaskIndex } = await this.connection
          .getRepository(Task)
          .createQueryBuilder('task')
          .select('task.index', 'leadingTaskIndex')
          .where('task.id = :taskId', { taskId: dto.leadingTaskId })
          .getRawOne()

        task.index = leadingTaskIndex + 1
      }

      const newIndex = task.index

      await this.connection
        .getRepository(Task)
        .createQueryBuilder('task')
        .update()
        .set({ index: () => 'index - 1' })
        .where('task.stage_id = :stageId', { stageId: fromStageId })
        .andWhere('task.index > :oldIndex', { oldIndex })
        .execute()

      await this.connection
        .getRepository(Task)
        .createQueryBuilder('task')
        .update()
        .set({ index: () => 'index + 1' })
        .where('task.stage_id = :stageId', { stageId: toStageId })
        .andWhere('task.index >= :newIndex', { newIndex })
        .execute()

      await this.connection.getRepository(Task).save(task)
    })

    return this.getFullTaskDto(task)
  }

  async addUserToTask(dto: UserTaskDto): Promise<void> {
    const task = await this.tasksRepository.getFullTaskIfExists(dto.taskId)
    const user = await this.usersRepository.getUserIfExists(dto.username)

    if (task.assignees.find((u) => u.id === user.id)) {
      throw new AppException(
        HttpStatus.BAD_REQUEST,
        'User is already assigned to this task'
      )
    }

    task.assignees.push(user)

    await this.connection.getRepository(Task).save(task)
  }

  async removeUserFromTask(dto: UserTaskDto): Promise<void> {
    const task = await this.tasksRepository.getFullTaskIfExists(dto.taskId)

    if (!task.assignees.find((u) => u.username === dto.username)) {
      throw new AppException(
        HttpStatus.BAD_REQUEST,
        'User is not assigned to this task'
      )
    }

    task.assignees = task.assignees.filter((u) => u.username !== dto.username)

    await this.connection.getRepository(Task).save(task)
  }
}

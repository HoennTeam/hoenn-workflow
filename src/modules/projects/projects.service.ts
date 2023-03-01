import { HttpStatus, Injectable } from '@nestjs/common'
import { AppException } from 'src/common/exceptions/app.exception'
import { dotenvConfig } from 'src/core/config/dotenv-config'
import { Logger } from 'src/core/logger'
import { Board } from 'src/entities/board'
import { Project } from 'src/entities/project'
import { DataSource } from 'typeorm'
import {
  UpdateProjectDto,
  UpdateProjectRequestDto,
} from './dto/update-project.dto'
import {
  CreateProjectDto,
  CreateProjectRequestDto,
} from './dto/create-project.dto'
import { ProjectDto } from './dto/project.dto'
import { FullProjectDto } from './dto/full-project.dto'
import { BoardDto } from './dto/board.dto'
import { FullBoardDto } from './dto/full-board.dto'
import { StageDto } from './dto/stage.dto'
import { Stage } from 'src/entities/stage'

@Injectable()
export class ProjectsService {
  constructor(
    private readonly logger: Logger,
    private readonly connection: DataSource
  ) {}

  async getProjects(): Promise<ProjectDto[]> {
    const projects = await this.connection
      .createQueryBuilder(Project, 'project')
      .leftJoinAndSelect('project.boards', 'boards')
      .getMany()

    return projects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }))
  }

  async getFullProject(id: number): Promise<FullProjectDto> {
    const project = await this.connection
      .createQueryBuilder(Project, 'project')
      .leftJoinAndSelect('project.boards', 'boards')
      .leftJoinAndSelect('boards.tasks', 'tasks')
      .where('project.id = :id', { id })
      .getOne()

    if (!project) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Project not found', { id })
    }

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      boards: project.boards.map((item) => ({
        id: item.id,
        name: item.name,
        isDefault: item.isDefault,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    }
  }

  async createProject(dto: CreateProjectRequestDto): Promise<CreateProjectDto> {
    const project = new Project({
      name: dto.name,
      description: dto.description ?? '',
      boards: [
        new Board({
          name: dotenvConfig.board.defaultName,
          isDefault: true,
        }),
      ],
    })

    const newProject = await this.connection.createEntityManager().save(project)

    return {
      id: newProject.id,
      name: newProject.name,
      description: newProject.description,
      createdAt: newProject.createdAt,
      updatedAt: newProject.updatedAt,
      board: {
        id: project.boards[0].id,
        name: project.boards[0].name,
        createdAt: project.boards[0].createdAt,
        updatedAt: project.boards[0].updatedAt,
      },
    }
  }

  async removeProject(id: number): Promise<void> {
    const project = await this.connection
      .createQueryBuilder(Project, 'project')
      .where('project.id = :id', { id })
      .getOne()

    if (!project) {
      throw new AppException(
        HttpStatus.NOT_FOUND,
        'Project not found or already removed'
      )
    }

    await this.connection.createEntityManager().softRemove(project)
  }

  async updateProject(
    id: number,
    dto: UpdateProjectRequestDto
  ): Promise<UpdateProjectDto> {
    const project = await this.connection
      .createQueryBuilder(Project, 'project')
      .where('project.id = :id', { id })
      .getOne()

    if (!project) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Project not found', { id })
    }

    project.name = dto.name ?? project.name
    project.description = dto.description ?? project.description
    project.updatedAt = new Date()

    await this.connection.createEntityManager().save(Project, project)

    return {
      id: project.id,
      description: project.description,
      name: project.name,
      updatedAt: project.updatedAt,
    }
  }

  async getBoards(projectId: number): Promise<BoardDto[]> {
    const projectExists = await this.connection
      .createEntityManager()
      .exists(Project, { where: { id: projectId } })

    if (!projectExists) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Project not found', {
        projectId,
      })
    }

    const boards = await this.connection
      .createQueryBuilder(Board, 'board')
      .where('board.project = :projectId', { projectId })
      .getMany()

    return boards.map((item) => ({
      id: item.id,
      name: item.name,
      isDefault: item.isDefault,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }))
  }

  async getFullBoard(
    projectId: number,
    boardId: number
  ): Promise<FullBoardDto> {
    const board = await this.connection
      .createQueryBuilder(Board, 'board')
      .innerJoin('board.project', 'project')
      .leftJoinAndSelect('board.stages', 'stages')
      .where('board.project = :projectId', { projectId })
      .andWhere('project.deletedAt is null')
      .andWhere('board.id = :boardId', { boardId })
      .getOne()

    if (!board) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Board not found', {
        boardId,
        projectId,
      })
    }

    return {
      id: board.id,
      name: board.name,
      isDefault: board.isDefault,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
      stages: board.stages.map((item) => ({
        id: item.id,
        name: item.name,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    }
  }

  async getStages(projectId: number, boardId: number): Promise<StageDto[]> {
    const boardExists = await this.connection
      .createEntityManager()
      .exists(Board, { where: { id: boardId, project: { id: projectId } } })

    if (!boardExists) {
      throw new AppException(
        HttpStatus.NOT_FOUND,
        'Project or board not found',
        {
          projectId,
          boardId,
        }
      )
    }

    const stages = await this.connection
      .createQueryBuilder(Stage, 'stage')
      .innerJoin('stage.board', 'board')
      .innerJoin('board.project', 'project')
      .where('board.project = :projectId', { projectId })
      .andWhere('project.deletedAt is null')
      .andWhere('board.id = :boardId', { boardId })
      .getMany()

    return stages.map((item) => ({
      id: item.id,
      name: item.name,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }))
  }
}

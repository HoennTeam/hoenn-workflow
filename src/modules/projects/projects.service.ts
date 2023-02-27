import { HttpStatus, Injectable } from '@nestjs/common'
import { AppException } from 'src/common/exceptions/app.exception'
import { dotenvConfig } from 'src/core/config/dotenv-config'
import { Logger } from 'src/core/logger'
import { Board } from 'src/entities/board'
import { Project } from 'src/entities/project'
import { DataSource } from 'typeorm'
import {
  ChangeTitleProjectDto,
  ChangeTitleProjectRequestDto,
} from './dto/change-title-project.dto'
import {
  CreateProjectDto,
  CreateProjectRequestDto,
} from './dto/create-project.dto'
import { GetProjectResponseDto } from './dto/get-project.dto'
import { GetProjectsResponseDto } from './dto/get-projects.dto'

@Injectable()
export class ProjectsService {
  constructor(
    private readonly logger: Logger,
    private readonly connection: DataSource
  ) {}

  public async getProjects(): Promise<GetProjectsResponseDto[]> {
    const projects = await this.connection
      .createQueryBuilder(Project, 'project')
      .leftJoinAndSelect('project.boards', 'boards')
      .getMany()

    return projects.map((project) => ({
      id: project.id,
      title: project.title,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      boards: project.boards.map((board) => ({
        id: board.id,
        name: board.name,
        createdAt: board.createdAt,
        updatedAt: board.updatedAt,
      })),
    }))
  }

  public async getProject(id: number): Promise<GetProjectResponseDto> {
    const project = await this.connection
      .createQueryBuilder(Project, 'project')
      .leftJoinAndSelect('project.boards', 'boards')
      .leftJoinAndSelect('boards.tasks', 'tasks')
      .where('project.id = :id', { id })
      .getOne()

    if (!project) {
      throw new AppException(HttpStatus.NOT_FOUND, 'project not found', { id })
    }

    return {
      id: project.id,
      title: project.title,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      boards: project.boards.map((item) => ({
        id: item.id,
        name: item.name,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        tasks: item.tasks.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
      })),
    }
  }

  public async createProject(
    dto: CreateProjectRequestDto
  ): Promise<CreateProjectDto> {
    const project = new Project({
      title: dto.title,
      description: dto.description,
    })

    const newProject = await this.connection.createEntityManager().save(project)

    const board = new Board({
      project: newProject,
      name: dotenvConfig.board.name,
      isDefault: dotenvConfig.board.isDefault,
    })
    const newBoard = await this.connection.createEntityManager().save(board)

    return {
      id: newProject.id,
      title: newProject.title,
      createdAt: newProject.createdAt,
      updatedAt: newProject.updatedAt,
      board: {
        id: newBoard.id,
        name: newBoard.name,
        createdAt: newBoard.createdAt,
        updatedAt: newBoard.updatedAt,
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

  async changeTitleProject(
    id: number,
    dto: ChangeTitleProjectRequestDto
  ): Promise<ChangeTitleProjectDto> {
    const project = await this.connection
      .createQueryBuilder(Project, 'project')
      .where('project.id = :id', { id })
      .getOne()

    if (!project) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Project not found', { id })
    }

    project.title = dto.title
    project.updatedAt = new Date()

    await this.connection.createEntityManager().save(Project, project)

    return {
      id: project.id,
      title: project.title,
      updatedAt: project.updatedAt,
    }
  }
}

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
      name: project.name,
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
      name: dto.name,
      description: dto.description,
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
}

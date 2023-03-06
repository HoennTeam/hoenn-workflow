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
import {
  UserToProjectRequestDto,
  UserToProjectResponseDto,
} from './dto/user-to-project.dto'
import { ProjectsUsers } from 'src/entities/projects-users'
import { User } from 'src/entities/user'
import { Role } from 'src/entities/role'
import { DeleteUserFromProjectDto } from './dto/delete-user-from-project.dto'

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
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    }))
  }

  async getFullProject(id: number): Promise<FullProjectDto> {
    const project = await this.connection
      .createQueryBuilder(Project, 'project')
      .leftJoinAndSelect('project.projectsUsers', 'projectsUsers')
      .leftJoinAndSelect('projectsUsers.user', 'user')
      .leftJoinAndSelect('projectsUsers.role', 'role')
      .leftJoinAndSelect('project.boards', 'boards')
      .where('project.id = :id', { id })
      .getOne()

    if (!project) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Project not found', { id })
    }

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      boards: project.boards.map((item) => ({
        id: item.id,
        name: item.name,
        isDefault: item.isDefault,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
      users: project.projectsUsers.map((item) => ({
        role: {
          id: item.role.id,
          name: item.role.name,
          description: item.role.description,
          isGlobal: item.role.isGlobal,
          createdAt: item.role.createdAt.toISOString(),
          updatedAt: item.role.updatedAt.toISOString(),
        },
        user: {
          id: item.user.id,
          fullName: item.user.fullName,
          email: item.user.email,
          createdAt: item.user.createdAt.toISOString(),
          updatedAt: item.user.updatedAt.toISOString(),
        },
      })),
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
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
      createdAt: newProject.createdAt.toISOString(),
      updatedAt: newProject.updatedAt.toISOString(),
      board: {
        id: project.boards[0].id,
        name: project.boards[0].name,
        createdAt: project.boards[0].createdAt.toISOString(),
        updatedAt: project.boards[0].updatedAt.toISOString(),
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
      updatedAt: project.updatedAt.toISOString(),
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
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
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
      .andWhere('project.deletedAt IS NULL')
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
      createdAt: board.createdAt.toISOString(),
      updatedAt: board.updatedAt.toISOString(),
      stages: board.stages.map((item) => ({
        id: item.id,
        name: item.name,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
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
      .andWhere('project.deletedAt IS NULL')
      .andWhere('board.id = :boardId', { boardId })
      .getMany()

    return stages.map((item) => ({
      id: item.id,
      name: item.name,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }))
  }

  async addUserToProject(
    dto: UserToProjectRequestDto
  ): Promise<UserToProjectResponseDto> {
    const project = await this.connection
      .createEntityManager()
      .findOne(Project, { where: { id: dto.projectId } })

    if (!project) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Project not found', {
        id: dto.projectId,
      })
    }

    const user = await this.connection
      .createEntityManager()
      .findOne(User, { where: { username: dto.username } })

    if (!user) {
      throw new AppException(HttpStatus.NOT_FOUND, 'User not found')
    }

    const role = await this.connection
      .createEntityManager()
      .findOne(Role, { where: { id: dto.roleId } })

    if (!role) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Role not found')
    }

    if (role.isGlobal) {
      throw new AppException(HttpStatus.BAD_REQUEST, 'Role is global')
    }

    const userExistsInProject = await this.connection
      .createQueryBuilder(ProjectsUsers, 'projectsUsers')
      .where('projectsUsers.user = :userId', { userId: user.id })
      .andWhere('projectsUsers.project = :projectId', {
        projectId: dto.projectId,
      })
      .getOne()

    if (userExistsInProject) {
      throw new AppException(
        HttpStatus.BAD_REQUEST,
        'User already exists in project',
        { user: user.username }
      )
    }

    const created = new ProjectsUsers({
      project: project,
      role: role,
      user: user,
    })

    await this.connection.createEntityManager().save(ProjectsUsers, created)

    return {
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
      },
      users: {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        role: {
          id: role.id,
          name: role.name,
          isGlobal: role.isGlobal,
          description: role.description,
          createdAt: role.createdAt.toISOString(),
          updatedAt: role.updatedAt.toISOString(),
        },
      },
    }
  }

  async removeUserFromProject(dto: DeleteUserFromProjectDto): Promise<void> {
    const projectsUsers = await this.connection
      .createQueryBuilder(ProjectsUsers, 'projectsUsers')
      .leftJoinAndSelect('projectsUsers.project', 'project')
      .leftJoinAndSelect('projectsUsers.user', 'user')
      .where('project.id = :projectId', { projectId: dto.projectId })
      .andWhere('user.username = :username', { username: dto.username })
      .getOne()

    if (!projectsUsers) {
      throw new AppException(
        HttpStatus.NOT_FOUND,
        'Project not found or user is not in this project',
        { user: dto.username }
      )
    }

    const removed = await this.connection
      .createEntityManager()
      .remove(projectsUsers)
  }

  async changeUserRoleInProject(
    dto: UserToProjectRequestDto
  ): Promise<UserToProjectResponseDto> {
    const project = await this.connection
      .createEntityManager()
      .findOne(Project, { where: { id: dto.projectId } })

    if (!project) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Project not found', {
        id: dto.projectId,
      })
    }

    const user = await this.connection
      .createEntityManager()
      .findOne(User, { where: { username: dto.username } })

    const role = await this.connection
      .createEntityManager()
      .findOne(Role, { where: { id: dto.roleId, isGlobal: false } })

    if (!role || !user) {
      throw new AppException(
        HttpStatus.BAD_REQUEST,
        'The entered data is not correct',
        { user: dto.username, role: dto.roleId }
      )
    }

    const projectsUsers = await this.connection
      .createQueryBuilder(ProjectsUsers, 'projectsUsers')
      .where('projectsUsers.user = :userId', { userId: user.id })
      .andWhere('projectsUsers.project = :projectId', {
        projectId: dto.projectId,
      })
      .getOne()

    if (!projectsUsers) {
      throw new AppException(
        HttpStatus.NOT_FOUND,
        'User not exists in project',
        { user: user.username }
      )
    }

    projectsUsers.role = role

    const updated = await this.connection
      .createEntityManager()
      .save(ProjectsUsers, projectsUsers)

    return {
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
      },
      users: {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        role: {
          id: role.id,
          name: role.name,
          isGlobal: role.isGlobal,
          description: role.description,
          createdAt: role.createdAt.toISOString(),
          updatedAt: role.updatedAt.toISOString(),
        },
      },
    }
  }
}

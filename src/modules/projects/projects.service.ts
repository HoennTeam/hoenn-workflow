import { HttpStatus, Injectable } from '@nestjs/common'
import { AppException } from '../../common/exceptions/app.exception'
import { dotenvConfig } from '../../core/config/dotenv-config'
import { Logger } from '../../core/logger'
import { Board } from '../../entities/board'
import { Project } from '../../entities/project'
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
import {
  UserToProjectRequestDto,
  UserToProjectResponseDto,
} from './dto/user-to-project.dto'
import { ProjectsUsers } from '../../entities/projects-users'
import { User } from '../../entities/user'
import { Role } from '../../entities/role'
import { DeleteUserFromProjectDto } from './dto/delete-user-from-project.dto'
import { Stage } from '../../entities/stage'
import { CreateStageDto } from './dto/create-stage.dto'
import { RemoveStageDto } from './dto/delete-stage.dto'
import { UpdateStageDto } from './dto/update-stage.dto'
import { CreateBoardDto } from './dto/create-board.dto'
import { UpdateBoardDto } from './dto/update-board.dto'

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
          isImmutable: item.role.isImmutable,
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
    const project = await this.getProjectIfExists(id)

    await this.connection.createEntityManager().softRemove(project)
  }

  async updateProject(
    id: number,
    dto: UpdateProjectRequestDto
  ): Promise<UpdateProjectDto> {
    const project = await this.getProjectIfExists(id)

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
    await this.getProjectIfExists(projectId)

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
    const project = await this.getProjectIfExists(dto.projectId)

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
          fullName: user.fullName,
          email: user.email,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        role: {
          name: role.name,
          isGlobal: role.isGlobal,
          isImmutable: role.isImmutable,
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

    await this.connection.createEntityManager().remove(projectsUsers)
  }

  async changeUserRoleInProject(
    dto: UserToProjectRequestDto
  ): Promise<UserToProjectResponseDto> {
    const projectsUsers = await this.connection
      .createQueryBuilder(ProjectsUsers, 'projectsUsers')
      .leftJoinAndSelect('projectsUsers.project', 'project')
      .leftJoinAndSelect('projectsUsers.user', 'user')
      .leftJoinAndSelect('projectsUsers.role', 'role')
      .where('user.username = :username', { username: dto.username })
      .andWhere('projectsUsers.project = :projectId', {
        projectId: dto.projectId,
      })
      .getOne()

    if (!projectsUsers) {
      throw new AppException(
        HttpStatus.NOT_FOUND,
        'User not exists in project',
        { user: dto.username }
      )
    }

    const role = await this.connection
      .getRepository(Role)
      .findOne({ where: { id: dto.roleId } })

    if (!role) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Role not found')
    }

    if (role.isGlobal) {
      throw new AppException(HttpStatus.BAD_REQUEST, 'Role is global')
    }

    projectsUsers.role = role

    await this.connection.getRepository(ProjectsUsers).save(projectsUsers)

    return {
      project: {
        id: projectsUsers.project.id,
        name: projectsUsers.project.name,
        description: projectsUsers.project.description,
        createdAt: projectsUsers.project.createdAt.toISOString(),
        updatedAt: projectsUsers.project.updatedAt.toISOString(),
      },
      users: {
        user: {
          fullName: projectsUsers.user.fullName,
          email: projectsUsers.user.email,
          createdAt: projectsUsers.user.createdAt.toISOString(),
          updatedAt: projectsUsers.user.updatedAt.toISOString(),
        },
        role: {
          name: projectsUsers.role.name,
          isGlobal: projectsUsers.role.isGlobal,
          isImmutable: projectsUsers.role.isImmutable,
          description: projectsUsers.role.description,
          createdAt: projectsUsers.role.createdAt.toISOString(),
          updatedAt: projectsUsers.role.updatedAt.toISOString(),
        },
      },
    }
  }

  async createBoard(dto: CreateBoardDto): Promise<BoardDto> {
    const project = await this.getProjectIfExists(dto.projectId)

    const newBoard = new Board({
      name: dto.name,
      isDefault: false,
      project: project,
    })

    const created = await this.connection.getRepository(Board).save(newBoard)

    return {
      id: created.id,
      name: created.name,
      isDefault: created.isDefault,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    }
  }

  async removeBoard(projectId: number, boardId: number): Promise<void> {
    const board = await this.connection
      .createQueryBuilder(Board, 'board')
      .where('board.project = :projectId', { projectId })
      .andWhere('board.id = :boardId', { boardId })
      .getOne()

    if (!board) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Board not found', {
        boardId,
      })
    }

    if (board.isDefault) {
      throw new AppException(
        HttpStatus.BAD_REQUEST,
        'You cannot delete default board'
      )
    }

    await this.connection.getRepository(Board).softRemove(board)
  }

  async updateBoard(dto: UpdateBoardDto): Promise<BoardDto> {
    const board = await this.connection
      .createQueryBuilder(Board, 'board')
      .where('board.project = :projectId', { projectId: dto.projectId })
      .andWhere('board.id = :boardId', { boardId: dto.boardId })
      .getOne()

    if (!board) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Board not found', {
        id: dto.boardId,
      })
    }

    if (dto.isDefault) {
      await this.connection
        .createQueryBuilder(Board, 'board')
        .innerJoin('board.project', 'project')
        .update(Board)
        .set({ isDefault: false })
        .where('project.id = :projectId', { projectId: dto.projectId })
        .execute()
    }

    Object.assign(board, {
      name: dto.name,
      isDefault: dto.isDefault || board.isDefault,
    })

    const updated = await this.connection.getRepository(Board).save(board)

    return {
      id: updated.id,
      name: updated.name,
      isDefault: updated.isDefault,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  async getProjectIfExists(id: number): Promise<Project> {
    const project = await this.connection
      .getRepository(Project)
      .findOne({ where: { id } })

    if (!project) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Project not found', {
        id,
      })
    }

    return project
  }

  async createStage(dto: CreateStageDto): Promise<StageDto> {
    const board = await this.getBoardIfExists(dto.projectId, dto.boardId)

    const newStage = new Stage({
      name: dto.name,
      board: board,
    })

    const created = await this.connection.getRepository(Stage).save(newStage)

    return {
      id: created.id,
      name: created.name,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    }
  }

  async removeStage(dto: RemoveStageDto): Promise<void> {
    await this.getBoardIfExists(dto.projectId, dto.boardId)

    const stage = await this.connection
      .createQueryBuilder(Stage, 'stage')
      .where('stage.id = :stageId', { stageId: dto.stageId })
      .getOne()

    if (!stage) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Stage not found', {
        id: dto.stageId,
      })
    }

    await this.connection.getRepository(Stage).softRemove(stage)
  }

  async updateStage(dto: UpdateStageDto): Promise<StageDto> {
    await this.getBoardIfExists(dto.projectId, dto.boardId)

    const stage = await this.connection
      .createQueryBuilder(Stage, 'stage')
      .where('stage.id = :stageId', { stageId: dto.stageId })
      .getOne()

    if (!stage) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Stage not found', {
        id: dto.stageId,
      })
    }

    if (dto.name) {
      stage.name = dto.name
    }

    const updated = await this.connection.getRepository(Stage).save(stage)

    return {
      id: updated.id,
      name: updated.name,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  async getBoardIfExists(projectId: number, boardId: number): Promise<Board> {
    const board = await this.connection
      .createQueryBuilder(Board, 'board')
      .innerJoin('board.project', 'project')
      .where('board.project = :projectId', { projectId })
      .andWhere('board.id = :boardId', { boardId })
      .getOne()

    if (!board) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Board not found', {
        boardId,
      })
    }

    return board
  }
}

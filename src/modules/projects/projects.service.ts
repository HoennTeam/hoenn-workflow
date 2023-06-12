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
import { ProjectsRepository } from './projects.repository'
import { Config } from '../../core/config'
import { AuthPayload } from '../../common/interfaces/auth-payload.interface'
import { PermissionsService } from '../auth/services/permissions.service'
import {
  PERMISSIONS,
  PROJECT_PERMISSIONS,
} from '../../common/const/permissions.const'

@Injectable()
export class ProjectsService {
  constructor(
    private readonly logger: Logger,
    private readonly config: Config,
    private readonly connection: DataSource,
    private readonly projectsRepository: ProjectsRepository,
    private readonly permissionsService: PermissionsService
  ) {}

  async getProjects(payload: AuthPayload): Promise<ProjectDto[]> {
    let projects
    const isGlobal = await this.permissionsService.hasGlobalPermission(
      payload.username,
      PERMISSIONS.PROJECTS.READ
    )

    if (isGlobal) {
      projects = await this.connection
        .createQueryBuilder(Project, 'project')
        .orderBy('project.createdAt', 'ASC')
        .getMany()
    } else {
      projects = await this.connection
        .createQueryBuilder(Project, 'project')
        .innerJoin('project.projectsUsers', 'projectsUsers')
        .where('projectsUsers.user = :userId', { userId: payload.id })
        .orderBy('project.createdAt', 'ASC')
        .getMany()
    }

    return projects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    }))
  }

  async getFullProject(
    id: number,
    payload: AuthPayload
  ): Promise<FullProjectDto> {
    const project = await this.projectsRepository.getFullProjectIfExists(id)

    await this.checkPermission(payload, id, PROJECT_PERMISSIONS.PROJECT.READ)

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
          username: item.user.username,
          id: item.user.id,
          fullName: item.user.fullName,
          email: item.user.email,
          roleName: item.user.globalRole.name,
          createdAt: item.user.createdAt.toISOString(),
          updatedAt: item.user.updatedAt.toISOString(),
        },
      })),
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    }
  }

  async createProject(
    dto: CreateProjectRequestDto,
    payload: AuthPayload
  ): Promise<CreateProjectDto> {
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
    const roleOwner = await this.connection
      .createEntityManager()
      .findOne(Role, { where: { name: 'Project Owner' } })

    if (!roleOwner) {
      throw new AppException(
        HttpStatus.NOT_FOUND,
        'Role "Project Owner" not found'
      )
    }

    const project_user = new ProjectsUsers({
      project: newProject,
      role: roleOwner,
      user: new User({ id: payload.id }),
    })

    await this.connection.createEntityManager().save(project_user)

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

  async removeProject(id: number, payload: AuthPayload): Promise<void> {
    const project = await this.projectsRepository.getProjectIfExists(id)

    await this.checkPermission(payload, id, PROJECT_PERMISSIONS.PROJECT.DELETE)

    await this.connection.createEntityManager().softRemove(project)
  }

  async updateProject(
    id: number,
    dto: UpdateProjectRequestDto,
    payload: AuthPayload
  ): Promise<UpdateProjectDto> {
    await this.checkPermission(payload, id, PROJECT_PERMISSIONS.PROJECT.UPDATE)
    const project = await this.projectsRepository.getProjectIfExists(id)

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

  async addUserToProject(
    dto: UserToProjectRequestDto,
    payload: AuthPayload
  ): Promise<UserToProjectResponseDto> {
    const project = await this.projectsRepository.getProjectIfExists(
      dto.projectId
    )

    await this.checkLocalPermission(
      payload,
      project.id,
      PROJECT_PERMISSIONS.TEAM.UPDATE,
      PERMISSIONS.PROJECTS.UPDATE
    )

    const user = await this.connection.createEntityManager().findOne(User, {
      where: { username: dto.username },
      relations: { globalRole: true },
    })

    if (!user) {
      throw new AppException(HttpStatus.NOT_FOUND, 'User not found')
    }

    const role = await this.connection.createEntityManager().findOne(Role, {
      where: { name: dto.roleName ?? this.config.users.defaultProjectRole },
    })

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
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          roleName: user.globalRole.name,
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

  async removeUserFromProject(
    dto: DeleteUserFromProjectDto,
    payload: AuthPayload
  ): Promise<void> {
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

    await this.checkLocalPermission(
      payload,
      dto.projectId,
      PROJECT_PERMISSIONS.TEAM.UPDATE,
      PERMISSIONS.PROJECTS.UPDATE
    )

    const roleOwner = await this.connection
      .createEntityManager()
      .findOne(Role, { where: { name: 'Project Owner' } })

    if (!roleOwner) {
      throw new AppException(
        HttpStatus.NOT_FOUND,
        'Role "Project Owner" not found'
      )
    }

    const countOwners = await this.connection
      .createQueryBuilder(ProjectsUsers, 'projectsUsers')
      .innerJoin('projectsUsers.role', 'roles')
      .select('projectsUsers.project', 'project')
      .addSelect('projectsUsers.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .where('roles.name = :roleName', { roleName: 'Project Owner' })
      .andWhere('projectsUsers.project = :projectId', {
        projectId: dto.projectId,
      })
      .groupBy('projectsUsers.project, projectsUsers.role')
      .getRawOne()

    if (countOwners.count == 1) {
      throw new AppException(HttpStatus.BAD_REQUEST, 'Owner cannot be deleted')
    }

    await this.connection.createEntityManager().remove(projectsUsers)
  }

  async changeUserRoleInProject(
    dto: UserToProjectRequestDto,
    payload: AuthPayload
  ): Promise<UserToProjectResponseDto> {
    const projectsUsers = await this.connection
      .createQueryBuilder(ProjectsUsers, 'projectsUsers')
      .leftJoinAndSelect('projectsUsers.project', 'project')
      .leftJoinAndSelect('projectsUsers.user', 'user')
      .leftJoinAndSelect('projectsUsers.role', 'role')
      .leftJoinAndSelect('user.globalRole', 'globalRole')
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

    await this.checkLocalPermission(
      payload,
      dto.projectId,
      PROJECT_PERMISSIONS.TEAM.UPDATE,
      PERMISSIONS.PROJECTS.UPDATE
    )

    const role = await this.connection.getRepository(Role).findOne({
      where: { name: dto.roleName ?? this.config.users.defaultProjectRole },
    })

    if (!role) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Role not found')
    }

    if (role.isGlobal) {
      throw new AppException(HttpStatus.BAD_REQUEST, 'Role is global')
    }

    projectsUsers.role = role

    const countOwners = await this.connection
      .createQueryBuilder(ProjectsUsers, 'projectsUsers')
      .innerJoin('projectsUsers.role', 'roles')
      .select('projectsUsers.project', 'project')
      .addSelect('projectsUsers.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .where('roles.name = :roleName', { roleName: 'Project Owner' })
      .andWhere('projectsUsers.project = :projectId', {
        projectId: dto.projectId,
      })
      .groupBy('projectsUsers.project, projectsUsers.role')
      .getRawOne()

    if (countOwners.count == 1) {
      throw new AppException(
        HttpStatus.BAD_REQUEST,
        'The project must have at least one owner'
      )
    }

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
          username: projectsUsers.user.username,
          fullName: projectsUsers.user.fullName,
          email: projectsUsers.user.email,
          roleName: projectsUsers.user.globalRole.name,
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

  async checkPermission(
    payload: AuthPayload,
    projectId: number,
    permission: string
  ): Promise<void> {
    const isLocalPer = await this.permissionsService.hasProjectPermission(
      payload.username,
      projectId,
      permission
    )

    const isGlobalPer = await this.permissionsService.hasGlobalPermission(
      payload.username,
      permission
    )

    if (!isGlobalPer && !isLocalPer)
      throw new AppException(HttpStatus.FORBIDDEN, 'No Access')
  }

  async checkLocalPermission(
    payload: AuthPayload,
    projectId: number,
    permissionLocal: string,
    permissionGlobal: string
  ): Promise<void> {
    const isLocalPer = await this.permissionsService.hasProjectPermission(
      payload.username,
      projectId,
      permissionLocal
    )

    const isGlobalPer = await this.permissionsService.hasGlobalPermission(
      payload.username,
      permissionGlobal
    )

    if (!isGlobalPer && !isLocalPer)
      throw new AppException(HttpStatus.FORBIDDEN, 'No Access')
  }
}

import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { randomBytes } from 'crypto'
import { DataSource } from 'typeorm'
import { AppException } from '../../common/exceptions/app.exception'
import { Config } from '../../core/config'
import { Logger } from '../../core/logger'
import { Role } from '../../entities/role'
import { User } from '../../entities/user'
import { PasswordsService } from '../auth/services/passwords.service'
import { CreateUserDto, CreateUserOutDto } from './dto/create-user.dto'
import { FullUserDto } from './dto/full-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDto } from './dto/user.dto'
import { UsersRepository } from './users.repository'
import { UpdateUserRoleDto } from './dto/update-user-role.dto'

@Injectable()
export class UsersService {
  constructor(
    private readonly logger: Logger,
    private readonly config: Config,
    private readonly connection: DataSource,
    private readonly passwordsService: PasswordsService,
    private readonly usersRepository: UsersRepository
  ) {}

  public createUser(dto: CreateUserDto): Promise<CreateUserOutDto> {
    return this.createUserWithRole(dto, this.config.users.defaultRole)
  }

  public createSystemAdmin(
    administratorEmail: string
  ): Promise<CreateUserOutDto> {
    return this.createUserWithRole(
      {
        email: administratorEmail,
        username: this.config.users.adminUsername,
        fullName: this.config.users.adminUsername,
      },
      this.config.users.adminRole
    )
  }

  private async createUserWithRole(
    dto: CreateUserDto,
    roleName: string
  ): Promise<CreateUserOutDto> {
    await this.checkUserAlreadyExists(dto.username, dto.email)
    const role = await this.connection.getRepository(Role).findOne({
      select: {
        id: true,
      },
      where: {
        name: roleName,
      },
    })

    const plainPassword = this.generateRandomPassword()
    const password = await this.passwordsService.hashPassword(plainPassword)
    const user = new User({
      username: dto.username,
      password,
      email: dto.email,
      fullName: dto.fullName,
      requiredPasswordChange: true,
      globalRole: role!,
    })

    await this.connection.getRepository(User).save(user)

    this.logger.info('User account successfully created', {
      ...user,
      password: undefined,
    })

    return {
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      password: plainPassword,
      roleName: role!.name,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.createdAt.toISOString(),
    }
  }

  private async checkUserAlreadyExists(
    username: string,
    email: string
  ): Promise<void> {
    const user = await this.connection.getRepository(User).findOne({
      where: [{ username }, { email }],
    })

    if (user) {
      throw new AppException(
        HttpStatus.CONFLICT,
        'Username or email is already taken'
      )
    }
  }

  private generateRandomPassword(): string {
    return randomBytes(this.config.users.passwordMinLength).toString('hex')
  }

  async getUsers(): Promise<UserDto[]> {
    const users = await this.connection
      .createQueryBuilder(User, 'user')
      .leftJoinAndSelect('user.globalRole', 'globalRole')
      .getMany()

    return users.map((user) => ({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      roleName: user.globalRole.name,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }))
  }

  async removeUser(username: string): Promise<void> {
    const user = await this.usersRepository.getUserIfExists(username)
    if (user.globalRole.name == 'Administrator') {
      throw new AppException(
        HttpStatus.BAD_REQUEST,
        'Administrator cannot be deleted',
        {
          roleName: user.globalRole.name,
        }
      )
    }
    await this.connection.getRepository(User).softRemove(user)
  }

  async getFullUser(username: string): Promise<FullUserDto> {
    const user = await this.usersRepository.getUserIfExists(username)

    return {
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      bio: user.bio,
      roleName: user.globalRole.name,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }
  }

  async updateUser(dto: UpdateUserDto): Promise<FullUserDto> {
    const user = await this.usersRepository.getUserIfExists(dto.username)

    Object.assign(user, {
      bio: dto.bio ?? user.bio,
      fullName: dto.fullName ?? user.fullName,
      email: dto.email ?? user.email,
    })

    await this.connection.getRepository(User).save(user)

    return {
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      bio: user.bio,
      roleName: user.globalRole.name,
      createdAt: user.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  async updateUserRole(dto: UpdateUserRoleDto): Promise<void> {
    const user = await this.usersRepository.getUserIfExists(dto.username)

    await this.connection.getRepository(User).save(user)

    const role = await this.connection
      .getRepository(Role)
      .findOne({ where: { name: dto.roleName } })
    if (!role) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Role not found', {
        name: dto.roleName,
      })
    }

    user.globalRole = role

    await this.connection.getRepository(User).save(user)
  }
}

import { HttpStatus, Injectable } from '@nestjs/common'
import { randomBytes } from 'crypto'
import { DataSource } from 'typeorm'
import { AppException } from '../../common/exceptions/app.exception'
import { Config } from '../../core/config'
import { Logger } from '../../core/logger'
import { Role } from '../../entities/role'
import { User } from '../../entities/user'
import { PasswordsService } from '../auth/passwords.service'
import { CreateUserDto, CreateUserOutDto } from './dto/create-user.dto'

@Injectable()
export class UsersService {
  constructor(
    private readonly logger: Logger,
    private readonly config: Config,
    private readonly connection: DataSource,
    private readonly passwordsService: PasswordsService
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
}

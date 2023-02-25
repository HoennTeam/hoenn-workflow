import { HttpStatus, Injectable } from '@nestjs/common'
import { randomBytes } from 'crypto'
import { DataSource } from 'typeorm'
import { AppException } from '../../common/exceptions/app.exception'
import { Config } from '../../core/config'
import { Logger } from '../../core/logger'
import { User } from '../../entities/user'
import { CreateUserDto, CreateUserOutDto } from './dto/create-user.dto'

@Injectable()
export class UsersService {
  constructor(
    private readonly logger: Logger,
    private readonly config: Config,
    private readonly connection: DataSource
  ) {}

  public async createUser(dto: CreateUserDto): Promise<CreateUserOutDto> {
    await this.checkUserAlreadyExists(dto.username, dto.email)

    const password = this.generateRandomPassword()
    const user = new User({
      username: dto.username,
      password,
      email: dto.email,
      fullName: dto.fullName,
      requiredPasswordChange: true,
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
      password: user.password,
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

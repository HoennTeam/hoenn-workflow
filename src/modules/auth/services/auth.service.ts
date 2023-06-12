import { HttpStatus, Injectable } from '@nestjs/common'
import { DataSource, IsNull, Not } from 'typeorm'
import { AppException } from '../../../common/exceptions/app.exception'
import { User } from '../../../entities/user'
import { Config } from '../../../core/config'
import { Logger } from '../../../core/logger'
import { SignInDto } from '../dto/sign-in.dto'
import { TokenDto } from '../dto/token.dto'
import { ChangeOneTimePasswordDto } from '../dto/change-one-time-password.dto'
import { PasswordsService } from './passwords.service'
import { SessionsService } from './sessions.service'
import { AuthPayload } from '../../../common/interfaces/auth-payload.interface'
import { MeDto } from '../dto/me.dto'
import { Role } from '../../../entities/role'

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: Logger,
    private readonly config: Config,
    private readonly connection: DataSource,
    private readonly passwordsService: PasswordsService,
    private readonly sessionsService: SessionsService
  ) {}

  public async signIn(dto: SignInDto): Promise<TokenDto> {
    const user = await this.getUserByUsernameAndPassword(
      dto.username,
      dto.password
    )

    if (user.requiredPasswordChange) {
      this.logger.info(
        'User logged in for the first time. Requesting password change',
        { username: dto.username }
      )

      throw new AppException(
        HttpStatus.SEE_OTHER,
        'You are required to change your one-time password'
      )
    }

    const sessionId = await this.sessionsService.createSession({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      roleName: user.globalRole.name,
      permissions: user.globalRole.permissions.map((p) => p.name),
      projectsPermissions: user.projectsUsers.reduce((acc, cur) => {
        acc[cur.project.id] = cur.role.permissions.map((p) => p.name)

        return acc
      }, {} as Record<number, string[]>),
    })

    return {
      token: sessionId,
      user: {
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        roleName: user.globalRole.name,
        permissions: user.globalRole.permissions.map((p) => p.name),
        projectsPermissions: user.projectsUsers.reduce((acc, cur) => {
          acc[cur.project.id] = cur.role.permissions.map((p) => p.name)

          return acc
        }, {} as Record<number, string[]>),
      },
    }
  }

  public async changeOneTimePassword(
    dto: ChangeOneTimePasswordDto
  ): Promise<void> {
    const user = await this.getUserByUsernameAndPassword(
      dto.username,
      dto.password
    )

    if (!user.requiredPasswordChange) {
      throw new AppException(
        HttpStatus.BAD_REQUEST,
        'You are not required to change your password'
      )
    }

    const password = await this.passwordsService.hashPassword(dto.newPassword)
    user.password = password
    user.requiredPasswordChange = false

    await this.connection.getRepository(User).save(user)

    this.logger.info('User successfully changed one-time password', {
      username: dto.username,
    })
  }

  private async getUserByUsernameAndPassword(
    username: string,
    password: string
  ): Promise<User> {
    const user = await this.connection.getRepository(User).findOne({
      where: {
        username,
      },
      relations: {
        globalRole: {
          permissions: true,
        },
        projectsUsers: {
          project: true,
          role: {
            permissions: true,
          },
        },
      },
    })

    if (!user) {
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        'Provided credentials are incorrect'
      )
    }

    if (
      !(await this.passwordsService.validatePassword(password, user.password))
    ) {
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        'Provided credentials are incorrect'
      )
    }

    return user
  }

  public async getMe(payload: AuthPayload): Promise<MeDto> {
    return {
      username: payload.username,
      email: payload.email,
      fullName: payload.fullName,
      roleName: payload.roleName,
      permissions: payload.permissions,
      projectsPermissions: payload.projectsPermissions,
    }
  }
}

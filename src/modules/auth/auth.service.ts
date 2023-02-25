import { HttpStatus, Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { AppException } from '../../common/exceptions/app.exception'
import { User } from '../../entities/user'
import { Config } from '../../core/config'
import { Logger } from '../../core/logger'
import { SignInDto } from './dto/sign-in.dto'
import { TokenDto } from './dto/token.dto'
import { ChangeOneTimePasswordDto } from './dto/change-one-time-password.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: Logger,
    private readonly config: Config,
    private readonly connection: DataSource
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

    return {
      token: '',
      user: {
        username: user.username,
        email: user.email,
        fullName: user.fullName,
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

    user.password = dto.newPassword
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
    })

    if (!user) {
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        'Provided credentials are incorrect'
      )
    }

    if (user.password !== password) {
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        'Provided credentials are incorrect'
      )
    }

    return user
  }
}

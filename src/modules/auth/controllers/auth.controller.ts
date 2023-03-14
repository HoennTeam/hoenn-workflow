import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  forwardRef,
  Param,
} from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { Authorize } from '../../../common/decorators/authorize.decorator'
import { Payload } from '../../../common/decorators/payload.decorator'
import { AuthPayload } from '../../../common/interfaces/auth-payload.interface'
import { ExceptionResponse } from '../../../common/response/exception-response'
import { ChangeOneTimePasswordRequest } from '../api/change-one-time-password.api'
import { MeResponse } from '../api/me.api'
import { SignInRequest } from '../api/sign-in.dto'
import { TokenResponse } from '../api/token.api'
import { AuthService } from '../services/auth.service'
import { UsersService } from '../../users/users.service'
import { FullUserResponse } from '../../users/api/full-user.api'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService
  ) {}

  @Post('sign-in')
  @ApiOperation({ description: 'Sign In' })
  @ApiOkResponse({ type: TokenResponse })
  @ApiUnauthorizedResponse({ type: ExceptionResponse })
  @ApiResponse({
    type: ExceptionResponse,
    status: 303,
    description: 'Password change required',
  })
  public async signIn(
    @Body() signInRequest: SignInRequest
  ): Promise<TokenResponse> {
    return this.authService.signIn(signInRequest)
  }

  @ApiOperation({ description: 'Change one-time password' })
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ type: ExceptionResponse })
  @Post('change-one-time-password')
  public async changeOneTimePassword(
    @Body() changeOneTimePasswordRequest: ChangeOneTimePasswordRequest
  ): Promise<void> {
    return this.authService.changeOneTimePassword(changeOneTimePasswordRequest)
  }

  @ApiOperation({ description: 'Get authenticated user information' })
  @ApiOkResponse({ type: MeResponse })
  @ApiUnauthorizedResponse({ type: ExceptionResponse })
  @Get('/me')
  @Authorize({})
  public async getMe(@Payload() payload: AuthPayload): Promise<MeResponse> {
    return this.authService.getMe(payload)
  }

  @ApiOperation({ description: 'Get profile' })
  @ApiOkResponse({ type: MeResponse })
  @ApiUnauthorizedResponse({ type: ExceptionResponse })
  @Get('/profile/:username')
  public async getFullProfile(
    @Param('username') username: string
  ): Promise<FullUserResponse> {
    return this.usersService.getProfile(username)
  }
}

import { Body, Controller, Post } from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { ExceptionResponse } from '../../../common/response/exception-response'
import { ChangeOneTimePasswordRequest } from '../api/change-one-time-password.api'
import { SignInRequest } from '../api/sign-in.dto'
import { TokenResponse } from '../api/token.api'
import { AuthService } from '../services/auth.service'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}

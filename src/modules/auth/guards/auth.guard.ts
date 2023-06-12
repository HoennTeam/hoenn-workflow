import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AUTH_GUARD_METADATA_KEY } from '../../../common/const/auth-guard-metadata-key.const'
import {
  AUTHORIZATION_HEADER,
  AUTHORIZATION_SCHEME,
} from '../../../common/const/authorization.const'
import { AuthGuardOptions } from '../../../common/decorators/authorize.decorator'
import { Config } from '../../../core/config'
import { Logger } from '../../../core/logger'
import { PermissionsService } from '../services/permissions.service'
import { SessionsService } from '../services/sessions.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly config: Config,
    private readonly logger: Logger,
    private readonly sessionsService: SessionsService,
    private readonly permissionsService: PermissionsService
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    try {
      const options = this.reflector.get<AuthGuardOptions | undefined>(
        AUTH_GUARD_METADATA_KEY,
        context.getHandler()
      )

      if (!options) {
        return true
      }

      const authorizationHeader = request.headers[
        AUTHORIZATION_HEADER.toLowerCase()
      ] as string | undefined

      if (
        !authorizationHeader ||
        !authorizationHeader.startsWith(`${AUTHORIZATION_SCHEME} `)
      ) {
        return false
      }
      const token = authorizationHeader.replace(AUTHORIZATION_SCHEME, '').trim()

      const session = await this.sessionsService.getSession(token)

      if (!session) {
        return false
      }

      if (options.permission) {
        const hasPermission = await this.permissionsService.hasGlobalPermission(
          session.username,
          options.permission
        )

        if (!hasPermission) {
          return false
        }
      }

      request.authPayload = session

      return true
    } catch (e) {
      return false
    }
  }
}

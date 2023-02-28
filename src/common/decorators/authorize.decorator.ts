import { CustomDecorator, SetMetadata } from '@nestjs/common'
import { AUTH_GUARD_METADATA_KEY } from '../const/auth-guard-metadata-key.const'

export interface AuthGuardOptions {
  readonly permission: string
}

export const Authorize = (options: AuthGuardOptions): CustomDecorator =>
  SetMetadata(AUTH_GUARD_METADATA_KEY, options)

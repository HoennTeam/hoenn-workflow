import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PasswordsService } from './passwords.service'
import { SessionsService } from './sessions.service'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './guards/auth.guard'
import { PermissionsService } from './permissions.service'

@Module({
  providers: [
    AuthService,
    PasswordsService,
    SessionsService,
    { provide: APP_GUARD, useClass: AuthGuard },
    PermissionsService,
  ],
  controllers: [AuthController],
  exports: [AuthService, PasswordsService, SessionsService, PermissionsService],
})
export class AuthModule {}

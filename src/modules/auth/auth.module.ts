import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PasswordsService } from './passwords.service'
import { SessionsService } from './sessions.service'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './guards/auth.guard'

@Module({
  providers: [
    AuthService,
    PasswordsService,
    SessionsService,
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
  controllers: [AuthController],
  exports: [AuthService, PasswordsService, SessionsService],
})
export class AuthModule {}

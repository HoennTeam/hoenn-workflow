import { Module, forwardRef } from '@nestjs/common'
import { AuthService } from './services/auth.service'
import { AuthController } from './controllers/auth.controller'
import { PasswordsService } from './services/passwords.service'
import { SessionsService } from './services/sessions.service'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './guards/auth.guard'
import { PermissionsService } from './services/permissions.service'
import { RolesController } from './controllers/roles.controller'
import { RolesService } from './services/roles.service'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [
    AuthService,
    PasswordsService,
    SessionsService,
    { provide: APP_GUARD, useClass: AuthGuard },
    PermissionsService,
    RolesService,
  ],
  controllers: [AuthController, RolesController],
  exports: [AuthService, PasswordsService, SessionsService, PermissionsService],
})
export class AuthModule {}

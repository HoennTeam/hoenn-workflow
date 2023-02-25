import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PasswordsService } from './passwords.service'

@Module({
  providers: [AuthService, PasswordsService],
  controllers: [AuthController],
  exports: [AuthService, PasswordsService],
})
export class AuthModule {}

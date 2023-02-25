import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { InstanceController } from './instance.controller'
import { InstanceService } from './instance.service'

@Module({
  imports: [AuthModule],
  controllers: [InstanceController],
  providers: [InstanceService],
})
export class InstanceModule {}

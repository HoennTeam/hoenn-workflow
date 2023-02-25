import { Module } from '@nestjs/common'
import { UsersModule } from '../users/users.module'
import { InstanceController } from './instance.controller'
import { InstanceService } from './instance.service'

@Module({
  imports: [UsersModule],
  controllers: [InstanceController],
  providers: [InstanceService],
})
export class InstanceModule {}

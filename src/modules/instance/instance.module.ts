import { Module, forwardRef } from '@nestjs/common'
import { UsersModule } from '../users/users.module'
import { InstanceController } from './instance.controller'
import { InstanceService } from './instance.service'

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [InstanceController],
  providers: [InstanceService],
})
export class InstanceModule {}

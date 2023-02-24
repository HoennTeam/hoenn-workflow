import { Module } from '@nestjs/common'
import { ConfigModule } from './core/config/config.module'
import { InstanceModule } from './modules/instance/instance.module'

@Module({
  imports: [ConfigModule, InstanceModule],
})
export class AppModule {}

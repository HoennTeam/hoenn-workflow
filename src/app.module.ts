import { Module } from '@nestjs/common'
import { ConfigModule } from './core/config/config.module'
import { InstanceModule } from './modules/instance/instance.module'
import { LoggerModule } from './core/logger/logger.module'

@Module({
  imports: [ConfigModule, LoggerModule, InstanceModule],
})
export class AppModule {}

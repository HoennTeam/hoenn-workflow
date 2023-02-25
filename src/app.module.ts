import { Module } from '@nestjs/common'
import { ConfigModule } from './core/config/config.module'
import { InstanceModule } from './modules/instance/instance.module'
import { LoggerModule } from './core/logger/logger.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Config } from './core/config'
import { typeormDataSourceOptions } from './core/typeorm/dataSourceOptions'

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, LoggerModule],
      useFactory: (config: Config) => ({
        ...typeormDataSourceOptions,
        logger: 'advanced-console',
      }),
    }),
    InstanceModule,
  ],
})
export class AppModule {}

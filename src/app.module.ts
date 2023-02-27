import { Module } from '@nestjs/common'
import { ConfigModule } from './core/config/config.module'
import { InstanceModule } from './modules/instance/instance.module'
import { LoggerModule } from './core/logger/logger.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Config } from './core/config'
import { typeormDataSourceOptions } from './core/typeorm/dataSourceOptions'
import { ProjectsModule } from './modules/projects/projects.module'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'

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
    ProjectsModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}

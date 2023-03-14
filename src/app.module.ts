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
import { RedisModule } from './core/redis/redis.module'
import { Logger } from './core/logger'

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
    RedisModule.forRootAsync({
      useFactory: (config: Config, logger: Logger) => {
        return {
          connectionOptions: {
            host: config.redis.host,
            port: config.redis.port,
          },
          onClientReady: (client) => {
            logger.info('Redis client successfully initialized')

            client.on('error', (error) => {
              logger.error('Redis client error', { error })
            })

            client.on('connect', () => {
              logger.info('Redis client successfully connected')
            })
          },
        }
      },
      imports: [ConfigModule, LoggerModule],
      inject: [Config, Logger],
    }),
    AuthModule,
    InstanceModule,
    ProjectsModule,
    UsersModule,
  ],
})
export class AppModule {}

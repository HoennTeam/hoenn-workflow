import { join } from 'path'
import { DataSourceOptions } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { Config } from '../config'
import { dotenvConfig } from '../config/dotenv-config'

const config: Config = dotenvConfig

const baseDir = join(__dirname, '../../../src')

export const typeormDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  entities: [join(baseDir, 'entities/*.js')],
  migrations: [join(baseDir, 'migrations/*.js')],
  migrationsTableName: 'typeorm_migrations',
  migrationsRun: false,
  synchronize: false,
  migrationsTransactionMode: 'all',
  namingStrategy: new SnakeNamingStrategy(),
  cache: false,

  logging: config.logging.logDatabaseQueries,

  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  connectTimeoutMS: config.database.timeoutMs,
}

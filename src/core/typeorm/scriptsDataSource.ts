import { DataSource, DataSourceOptions } from 'typeorm'
import { typeormDataSourceOptions } from './dataSourceOptions'

const scriptsTypeormDataSourceOptions: DataSourceOptions = {
  ...typeormDataSourceOptions,
  entities: ['src/entities/*.ts'],
  migrations: ['src/migrations/*.ts'],
}

export const scriptsDataSource = new DataSource(scriptsTypeormDataSourceOptions)

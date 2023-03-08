import { DataSource } from 'typeorm'
import { typeormDataSourceOptions } from './dataSourceOptions'

export const dataSource = new DataSource(typeormDataSourceOptions)

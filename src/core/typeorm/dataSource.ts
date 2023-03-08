import { DataSource } from 'typeorm'
import { typeormDataSourceOptions } from './dataSourceOptions'
import pg from 'pg'

pg.types.setTypeParser(pg.types.builtins.INT8, (value: string) => {
  return parseInt(value)
})

export const dataSource = new DataSource(typeormDataSourceOptions)

import * as dotenv from 'dotenv'
import { Config } from './config.abstract'

function getBoolean(str?: string): boolean | undefined {
  if (str === 'false') return false
  if (str === 'true') return true
}

function load(): Config {
  dotenv.config()

  return {
    app: {
      development: process.env.NODE_ENV === 'development',
      port: Number(process.env.PORT) || 3000,
    },
    logging: {
      level: process.env.LOGGING_LEVEL || 'debug',
      logRequests: getBoolean(process.env.LOGGING_LOG_REQUESTS) ?? true,
      logDatabaseQueries:
        getBoolean(process.env.LOGGING_LOG_DATABASE_QUERIES) ?? true,
    },
    swagger: {
      enable: getBoolean(process.env.SWAGGER_ENABLE) ?? true,
      path: process.env.SWAGGER_PATH || 'swagger',
    },
    database: {
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USERNAME || 'workflow',
      name: process.env.DATABASE_NAME || 'workflow',
      password: process.env.DATABASE_PASSWORD || 'workflow',
      timeoutMs: Number(process.env.DATABASE_TIMEOUT_MS) || 10000,
    },
    users: {
      passwordMinLength: Number(process.env.USERS_PASSWORD_MIN_LENGTH) ?? 8,
    },
  }
}

export const dotenvConfig = load()

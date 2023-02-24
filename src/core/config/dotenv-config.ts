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
      logRequests: getBoolean(process.env.APP_LOG_REQUESTS) ?? true,
    },
    swagger: {
      enable: getBoolean(process.env.SWAGGER_ENABLE) ?? true,
      path: process.env.SWAGGER_PATH || 'swagger',
    },
  }
}

export const dotenvConfig = load()

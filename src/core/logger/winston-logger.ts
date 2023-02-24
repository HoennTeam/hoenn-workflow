import { Injectable } from '@nestjs/common'
import * as winston from 'winston'
import { Config } from '../config/config.abstract'
import { Logger } from './logger.abstract'

const localFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.timestamp(),
  winston.format.prettyPrint(),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, stack, message, ...meta }) => {
    return `[${timestamp}] ${level}: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
    } ${stack || ''}`
  })
)

const jsonFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, stack, message, ...meta }) =>
    JSON.stringify({
      level,
      message,
      stack,
      timestamp,
      meta,
    })
  )
)

@Injectable()
export class WinstonLogger extends Logger {
  constructor(private readonly config: Config) {
    super()
  }

  private readonly logger = winston.createLogger({
    format: this.config.app.development ? localFormat : jsonFormat,
    transports: [new winston.transports.Console({})],
    level: this.config.logging.level,
  })

  debug(message: string, context?: object): void {
    this.logger.debug(message, context)
  }
  info(message: string, context?: object): void {
    this.logger.info(message, context)
  }
  warn(message: string, context?: object): void {
    this.logger.warn(message, context)
  }
  error(message: string, context?: object) {
    this.logger.error(message, context)
  }
}

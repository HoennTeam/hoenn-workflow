import { Provider } from '@nestjs/common'
import { Logger } from './logger.abstract'
import { WinstonLogger } from './winston-logger'

export const winstonLoggerProvider: Provider = {
  provide: Logger,
  useClass: WinstonLogger,
}

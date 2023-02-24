import { Global, Module } from '@nestjs/common'
import { winstonLoggerProvider } from './winston-logger.provider'

@Global()
@Module({
  providers: [winstonLoggerProvider],
  exports: [winstonLoggerProvider],
})
export class LoggerModule {}

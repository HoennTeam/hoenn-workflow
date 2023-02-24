import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import { AppExceptionFilter } from './common/exception-filters/app.exception-filter'
import { GlobalExceptionFilter } from './common/exception-filters/global.exception-filter'
import LoggingInterceptor from './common/interceptors/logging.interceptor'
import { Config } from './core/config'
import { Logger } from './core/logger'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useGlobalFilters(
    new GlobalExceptionFilter(app.get(Logger)),
    new AppExceptionFilter()
  )

  app.useGlobalInterceptors(
    new LoggingInterceptor(app.get(Logger), app.get(Config))
  )

  await app.listen(process.env.PORT || 3000)
}
bootstrap()

import { ValidationError, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { AppExceptionFilter } from './common/exception-filters/app.exception-filter'
import { GlobalExceptionFilter } from './common/exception-filters/global.exception-filter'
import { HttpExceptionFilter } from './common/exception-filters/http.exception-filter'
import { ValidationException } from './common/exceptions/validation.exception'
import LoggingInterceptor from './common/interceptors/logging.interceptor'
import { Config } from './core/config'
import { Logger } from './core/logger'
import { setupSwagger } from './core/swagger'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.setGlobalPrefix('api')

  app.useGlobalFilters(
    new GlobalExceptionFilter(app.get(Logger)),
    new AppExceptionFilter(),
    new HttpExceptionFilter()
  )

  app.useGlobalInterceptors(
    new LoggingInterceptor(app.get(Logger), app.get(Config))
  )

  app.useGlobalPipes(
    new ValidationPipe({
      transform: false,
      whitelist: true,
      forbidUnknownValues: true,
      exceptionFactory: (errors: ValidationError[]) =>
        new ValidationException(errors),
    })
  )

  app.use(helmet())

  if (app.get(Config).app.enableCors) {
    app.enableCors()
  }

  setupSwagger(app)

  await app.listen(process.env.PORT || 3000)
}
bootstrap()

import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Config } from '../config'
import { APP_DESCRIPTION, APP_TITLE, APP_VERSION } from './swagger.const'

export function setupSwagger(app: NestExpressApplication) {
  const config = app.get(Config)
  if (!config.swagger.enable) return

  const documentConfig = new DocumentBuilder()
    .setTitle(APP_TITLE)
    .setDescription(APP_DESCRIPTION)
    .setVersion(APP_VERSION)
    .build()

  const document = SwaggerModule.createDocument(app, documentConfig)
  SwaggerModule.setup(config.swagger.path, app, document)
}

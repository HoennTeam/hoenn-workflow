import { Global, Module } from '@nestjs/common'
import { dotenvConfigProvider } from './dotenv-config.provider'

@Global()
@Module({
  providers: [dotenvConfigProvider],
  exports: [dotenvConfigProvider],
})
export class ConfigModule {}

import { Provider } from '@nestjs/common'
import { Config } from './config.abstract'
import { dotenvConfig } from './dotenv-config'

export const dotenvConfigProvider: Provider = {
  provide: Config,
  useValue: dotenvConfig,
}

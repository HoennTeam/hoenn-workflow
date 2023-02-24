import { Config } from './config.abstract'
import { dotenvConfig } from './dotenv-config'

export const dotenvConfigProvider = {
  provide: Config,
  useValue: dotenvConfig,
}

import * as dotenv from 'dotenv'
import { Config } from './config.abstract'

function load(): Config {
  dotenv.config()

  return {
    app: {
      port: Number(process.env.PORT) || 3000,
    },
  }
}

export const dotenvConfig = load()

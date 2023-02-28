export abstract class Config {
  readonly app: {
    readonly development: boolean
    readonly port: number
  }
  readonly logging: {
    readonly level: string
    readonly logRequests: boolean
    readonly logDatabaseQueries: boolean
  }
  readonly swagger: {
    readonly enable: boolean
    readonly path: string
  }
  readonly database: {
    readonly host: string
    readonly port: number
    readonly username: string
    readonly password: string
    readonly name: string
    readonly timeoutMs: number
  }
  readonly redis: {
    readonly host: string
    readonly port: number
  }
  readonly users: {
    readonly passwordMinLength: number
    readonly adminUsername: string
  }
  readonly passwords: {
    readonly saltRounds: number
  }
  readonly sessions: {
    readonly idLength: number
    readonly expiresSeconds: number
  }
}

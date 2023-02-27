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
  readonly board: {
    readonly name: string
    readonly isDefault: boolean
  }
}

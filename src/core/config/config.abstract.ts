export abstract class Config {
  readonly app: {
    readonly development: boolean
    readonly port: number
    readonly enableCors: boolean
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
    readonly defaultName: string
  }
  readonly redis: {
    readonly host: string
    readonly port: number
  }
  readonly users: {
    readonly passwordMinLength: number
    readonly adminUsername: string
    readonly defaultRole: string
    readonly adminRole: string
  }
  readonly passwords: {
    readonly saltRounds: number
  }
  readonly sessions: {
    readonly idLength: number
    readonly expiresSeconds: number
  }
}

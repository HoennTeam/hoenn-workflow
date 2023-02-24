export abstract class Config {
  readonly app: {
    readonly development: boolean
    readonly port: number
  }
  readonly logging: {
    readonly level: string
    readonly logRequests: boolean
  }
  readonly swagger: {
    readonly enable: boolean
    readonly path: string
  }
}

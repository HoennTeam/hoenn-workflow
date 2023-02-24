export abstract class Config {
  readonly app: {
    readonly development: boolean
    readonly port: number
  }
}

export abstract class Logger {
  abstract debug(message: string, context: object): void
  abstract info(message: string, context: object): void
  abstract warn(message: string, context: object): void
  abstract error(message: string, context: object, originalError?: Error)
}

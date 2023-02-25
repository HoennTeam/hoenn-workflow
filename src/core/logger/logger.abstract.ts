export abstract class Logger {
  abstract debug(message: string, context?: any): void
  abstract info(message: string, context?: any): void
  abstract warn(message: string, context?: any): void
  abstract error(message: string, context?: any)
}

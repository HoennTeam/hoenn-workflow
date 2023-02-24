import { HttpStatus } from '@nestjs/common'

export class AppException extends Error {
  constructor(
    public readonly code: HttpStatus,
    message: string,
    public readonly details?: object
  ) {
    super(message)
  }
}

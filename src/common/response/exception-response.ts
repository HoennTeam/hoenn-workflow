import { HttpStatus } from '@nestjs/common'

export class ExceptionResponse {
  public readonly code: HttpStatus
  public readonly message: string
  public readonly timestamp: string
  public readonly details?: object
}

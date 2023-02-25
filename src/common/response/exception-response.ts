import { HttpStatus } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class ExceptionResponse {
  @ApiProperty()
  public readonly code: HttpStatus

  @ApiProperty()
  public readonly message: string

  @ApiProperty()
  public readonly timestamp: string

  @ApiProperty()
  public readonly details?: object
}

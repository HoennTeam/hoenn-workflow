import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'

export class CreateStageRequest {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  public readonly name: string
}

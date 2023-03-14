import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'

export class CreateBoardRequest {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  public readonly name: string
}

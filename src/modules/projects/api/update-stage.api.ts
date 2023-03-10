import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateStageRequest {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @MinLength(1)
  public readonly name: string
}

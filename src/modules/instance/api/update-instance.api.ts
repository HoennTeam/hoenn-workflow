import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateInstanceRequest {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @IsOptional()
  public readonly name?: string

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @IsOptional()
  public readonly administratorEmail?: string
}

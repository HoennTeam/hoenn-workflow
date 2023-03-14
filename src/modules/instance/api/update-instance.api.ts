import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateInstanceRequest {
  @ApiPropertyOptional()
  @IsString()
  @MinLength(1)
  @IsOptional()
  public readonly name?: string

  @ApiPropertyOptional()
  @IsEmail()
  @MinLength(1)
  @IsOptional()
  public readonly administratorEmail?: string
}

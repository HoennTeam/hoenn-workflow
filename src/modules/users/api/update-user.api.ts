import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateUserRequest {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MinLength(1)
  public readonly fullName?: string

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  @MinLength(1)
  public readonly email?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public readonly bio?: string
}

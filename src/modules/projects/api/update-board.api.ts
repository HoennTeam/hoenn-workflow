import { ApiProperty } from '@nestjs/swagger'
import {
  Equals,
  IsBoolean,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'

export class UpdateBoardRequest {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @IsOptional()
  public readonly name?: string

  @ApiProperty()
  @IsBoolean()
  @Equals(true)
  @IsOptional()
  public readonly isDefault?: boolean
}

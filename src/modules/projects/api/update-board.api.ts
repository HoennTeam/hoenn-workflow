import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateBoardRequest {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @IsOptional()
  public readonly name?: string

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public readonly isDefault?: boolean
}

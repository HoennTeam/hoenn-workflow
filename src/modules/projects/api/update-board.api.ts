import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateBoardRequest {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @IsOptional()
  public readonly name?: string

  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => value === true || undefined)
  @IsOptional()
  public readonly isDefault?: boolean
}

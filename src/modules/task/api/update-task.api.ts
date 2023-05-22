import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString } from 'class-validator'

export class UpdateTaskRequest {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public readonly title?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public readonly description?: string
}

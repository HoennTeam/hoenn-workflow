import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsOptional } from 'class-validator'

export class MoveTaskRequest {
  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  public readonly stageId?: number

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  public readonly leadingTaskId?: number
}

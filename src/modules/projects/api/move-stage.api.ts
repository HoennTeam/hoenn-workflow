import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'

export class MoveStageRequest {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public readonly leadingStageId?: number
}

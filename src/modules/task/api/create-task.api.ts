import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsString } from 'class-validator'

export class CreateTaskRequest {
  @ApiProperty()
  @IsString()
  public readonly title: string

  @ApiProperty()
  @IsInt()
  public readonly stageId: number

  @ApiProperty()
  @IsInt()
  public readonly boardId: number
}

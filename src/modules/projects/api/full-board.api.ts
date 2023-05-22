import { ApiProperty } from '@nestjs/swagger'
import { StageResponse } from './stage.api'
import { TaskResponse } from '../../task/api/task.api'

export class FullBoardResponse {
  @ApiProperty()
  public readonly id: number

  @ApiProperty()
  public readonly name: string

  @ApiProperty()
  public readonly createdAt: string

  @ApiProperty()
  public readonly updatedAt: string

  @ApiProperty()
  public readonly stages: StageResponse[]

  @ApiProperty()
  public readonly tasks: TaskResponse[]
}

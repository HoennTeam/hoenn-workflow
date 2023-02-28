import { ApiProperty } from '@nestjs/swagger'
import { StageResponse } from './stage.api'

export class FullBoardResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  stages: StageResponse[]
}

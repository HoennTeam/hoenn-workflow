import { ApiProperty } from '@nestjs/swagger'
import { StageResponse } from './stage.api'

export class FullBoardResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  createdAt: string

  @ApiProperty()
  updatedAt: string

  @ApiProperty()
  stages: StageResponse[]
}

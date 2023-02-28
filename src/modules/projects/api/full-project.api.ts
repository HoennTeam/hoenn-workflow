import { ApiProperty } from '@nestjs/swagger'
import { BoardResponse } from './board.api'

export class FullProjectResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  description: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  boards: BoardResponse[]
}

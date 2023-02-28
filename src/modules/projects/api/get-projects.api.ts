import { ApiProperty } from '@nestjs/swagger'
import { appendFile } from 'fs'
import { Board } from 'src/entities/board'

class BoardResponse {
  @ApiProperty()
  public readonly id: number

  @ApiProperty()
  public readonly name: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}

export class ProjectResponse {
  @ApiProperty()
  public readonly id: number

  @ApiProperty()
  public readonly name: string

  @ApiProperty()
  public readonly createdAt: Date

  @ApiProperty()
  public readonly updatedAt: Date

  @ApiProperty({ type: [BoardResponse] })
  public readonly boards: BoardResponse[]
}

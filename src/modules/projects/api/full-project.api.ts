import { ApiProperty } from '@nestjs/swagger'
import { BoardResponse } from './board.api'
import { ProjectUsersResponse } from './project-users.api'

export class FullProjectResponse {
  @ApiProperty()
  public readonly id: number

  @ApiProperty()
  public readonly name: string

  @ApiProperty()
  public readonly description: string

  @ApiProperty()
  public readonly createdAt: string

  @ApiProperty()
  public readonly updatedAt: string

  @ApiProperty()
  public readonly boards: BoardResponse[]

  @ApiProperty()
  public readonly users: ProjectUsersResponse[]
}

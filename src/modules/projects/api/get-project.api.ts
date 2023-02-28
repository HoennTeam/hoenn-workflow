import { ApiProperty } from '@nestjs/swagger'

class TaskResponse {
  @ApiProperty()
  public readonly id: number

  @ApiProperty()
  public readonly title: string

  @ApiProperty()
  public readonly description: string

  @ApiProperty()
  public readonly createdAt: Date

  @ApiProperty()
  public readonly updatedAt: Date
}

class GetBoardResponse {
  @ApiProperty()
  public readonly id: number

  @ApiProperty()
  public readonly name: string

  @ApiProperty()
  public readonly createdAt: Date

  @ApiProperty()
  public readonly updatedAt: Date

  @ApiProperty({ type: [TaskResponse] })
  public readonly tasks: TaskResponse[]
}

export class GetProjectResponseById {
  @ApiProperty()
  public readonly id: number

  @ApiProperty()
  public readonly name: string

  @ApiProperty()
  public readonly description: string

  @ApiProperty()
  public readonly createdAt: Date

  @ApiProperty()
  public readonly updatedAt: Date

  @ApiProperty({ type: [GetBoardResponse] })
  public readonly boards: GetBoardResponse[]
}

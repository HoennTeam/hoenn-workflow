import { ApiProperty } from '@nestjs/swagger'
import { UserResponse } from '../../users/api/user.api'
import { StageResponse } from '../../projects/api/stage.api'

export class FullTaskResponse {
  @ApiProperty()
  public readonly id: number

  @ApiProperty()
  public readonly number: number

  @ApiProperty()
  public readonly title: string

  @ApiProperty()
  public readonly description: string

  @ApiProperty()
  public readonly index: number

  @ApiProperty()
  public readonly stage: StageResponse

  @ApiProperty()
  public readonly assignees: UserResponse[]

  @ApiProperty()
  public readonly createdAt: string

  @ApiProperty()
  public readonly updatedAt: string
}

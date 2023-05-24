import { StageDto } from '../../projects/dto/stage.dto'
import { UserDto } from '../../users/dto/user.dto'

export interface FullTaskDto {
  readonly id: number
  readonly number: number
  readonly title: string
  readonly description: string
  readonly index: number
  readonly stage: StageDto
  readonly assignees: UserDto[]
  readonly createdAt: string
  readonly updatedAt: string
}

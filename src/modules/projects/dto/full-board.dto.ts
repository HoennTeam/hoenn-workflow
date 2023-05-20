import { StageDto } from './stage.dto'
import { TaskDto } from './task.dto'

export interface FullBoardDto {
  readonly id: number
  readonly name: string
  readonly isDefault: boolean
  readonly stages: StageDto[]
  readonly tasks: TaskDto[]
  readonly createdAt: string
  readonly updatedAt: string
}

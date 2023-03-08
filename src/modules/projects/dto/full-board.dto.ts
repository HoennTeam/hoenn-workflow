import { StageDto } from './stage.dto'

export interface FullBoardDto {
  readonly id: number
  readonly name: string
  readonly isDefault: boolean
  readonly stages: StageDto[]
  readonly createdAt: string
  readonly updatedAt: string
}

import { StageDto } from './stage.dto'

export interface FullBoardDto {
  id: number
  name: string
  isDefault: boolean
  stages: StageDto[]
  createdAt: string
  updatedAt: string
}

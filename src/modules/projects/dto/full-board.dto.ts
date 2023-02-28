import { StageDto } from './stage.dto'

export interface FullBoardDto {
  id: number
  name: string
  description: string
  stage: StageDto[]
  createdAt: Date
  updatedAt: Date
}

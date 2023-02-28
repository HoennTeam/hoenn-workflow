import { BoardDto } from './board.dto'

export interface FullProjectDto {
  id: number
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  boards: BoardDto[]
}

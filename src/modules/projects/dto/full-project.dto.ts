import { BoardDto } from './board.dto'

export interface FullProjectDto {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
  boards: BoardDto[]
}

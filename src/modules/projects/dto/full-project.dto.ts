import { BoardDto } from './board.dto'

export interface FullProjectDto {
  readonly id: number
  readonly name: string
  readonly description: string
  readonly createdAt: string
  readonly updatedAt: string
  readonly boards: BoardDto[]
}

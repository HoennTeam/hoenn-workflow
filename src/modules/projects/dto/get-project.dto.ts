export interface GetProjectResponseDto {
  id: number
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  boards: BoardResponseDto[]
}

interface BoardResponseDto {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  tasks: TaskResponseDto[]
}

interface TaskResponseDto {
  id: number
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
}

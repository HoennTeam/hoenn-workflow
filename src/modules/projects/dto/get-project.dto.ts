export interface GetProjectResponseDto {
  id: number
  title: string
  createdAt: Date
  updatedAt: Date
  boards: BoardResponse[]
}

interface BoardResponse {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  tasks: TaskResponse[]
}

interface TaskResponse {
  id: number
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
}

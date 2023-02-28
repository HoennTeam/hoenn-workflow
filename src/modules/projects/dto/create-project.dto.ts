export interface CreateProjectDto {
  id: number
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  board: CreateBoardDto
}

interface CreateBoardDto {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateProjectRequestDto {
  name: string
  description?: string
}

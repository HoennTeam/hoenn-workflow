export interface CreateProjectDto {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
  board: CreateBoardDto
}

interface CreateBoardDto {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export interface CreateProjectRequestDto {
  name: string
  description?: string
}

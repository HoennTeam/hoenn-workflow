export interface CreateProjectDto {
  id: number
  title: string
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
  title: string
  description: string
}

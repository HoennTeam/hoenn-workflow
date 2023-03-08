export interface CreateProjectDto {
  readonly id: number
  readonly name: string
  readonly description: string
  readonly createdAt: string
  readonly updatedAt: string
  readonly board: CreateBoardDto
}

interface CreateBoardDto {
  readonly id: number
  readonly name: string
  readonly createdAt: string
  readonly updatedAt: string
}

export interface CreateProjectRequestDto {
  readonly name: string
  readonly description?: string
}

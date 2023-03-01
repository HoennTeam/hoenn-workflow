export interface UpdateProjectDto {
  readonly id: number
  readonly name: string
  readonly description: string
  readonly updatedAt: string
}

export interface UpdateProjectRequestDto {
  readonly name?: string
  readonly description?: string
}

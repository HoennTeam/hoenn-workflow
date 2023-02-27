export interface ChangeTitleProjectDto {
  readonly id: number
  readonly title: string
  readonly updatedAt: Date
}

export interface ChangeTitleProjectRequestDto {
  readonly title: string
}

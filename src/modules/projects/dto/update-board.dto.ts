export interface UpdateBoardDto {
  readonly projectSlug: number
  readonly boardSlug: number
  readonly name?: string
  readonly isDefault?: boolean
}

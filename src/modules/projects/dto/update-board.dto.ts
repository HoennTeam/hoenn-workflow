export interface UpdateBoardDto {
  readonly projectId: number
  readonly boardId: number
  readonly name?: string
  readonly isDefault?: boolean
}

export interface UpdateStageDto {
  readonly projectId: number
  readonly boardId: number
  readonly stageId: number
  readonly name?: string
}

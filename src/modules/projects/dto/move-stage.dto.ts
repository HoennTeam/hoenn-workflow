export interface MoveStageDto {
  readonly projectId: number
  readonly boardId: number
  readonly stageId: number
  readonly leadingStageId?: number
}

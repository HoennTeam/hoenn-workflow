import { Project } from '../../../entities/project'

export interface DeleteUserFromProjectDto {
  readonly username: string
  readonly projectId: number
}

export type ProjectWithCounts = Project & { boardsCount: number }

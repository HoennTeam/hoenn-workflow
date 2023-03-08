import { Project } from '../../../entities/project'

export interface DeleteUserFromProjectDto {
  readonly username: string
  readonly projectId: number
}

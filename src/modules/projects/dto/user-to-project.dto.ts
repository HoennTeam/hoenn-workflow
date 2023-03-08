import { ProjectUsersResponse } from '../api/project-users.api'
import { ProjectDto } from './project.dto'

export interface UserToProjectRequestDto {
  readonly projectId: number
  readonly username: string
  readonly roleId: number
}

export interface UserToProjectResponseDto {
  readonly project: ProjectDto
  readonly users: ProjectUsersResponse
}

import { ProjectUsersResponse } from '../api/project-users.api'
import { ProjectDto } from './project.dto'

export interface UserToProjectRequestDto {
  readonly user: string
  readonly role: string
}

export interface UserToProjectResponseDto {
  readonly project: ProjectDto
  readonly users: ProjectUsersResponse
}

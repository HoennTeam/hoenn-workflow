import { ProjectUsersResponse } from '../api/project-users.api'
import { ProjectDto } from './project.dto'

export interface AddUserToProjectRequestDto {
  readonly user: string
  readonly role: string
}

export interface AddUserToProjectResponseDto {
  readonly project: ProjectDto
  readonly user: ProjectUsersResponse
}

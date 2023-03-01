import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'
import { ProjectUsersResponse } from './project-users.api'
import { ProjectResponse } from './project.api'

export class AddUserToProjectRequest {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  public readonly user: string

  @ApiProperty()
  @IsString()
  @MinLength(1)
  public readonly role: string
}

export class AddUserToProjectResponse {
  public readonly project: ProjectResponse
  public readonly user: ProjectUsersResponse
}

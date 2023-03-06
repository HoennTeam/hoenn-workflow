import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString, MinLength } from 'class-validator'
import { ProjectUsersResponse } from './project-users.api'
import { ProjectResponse } from './project.api'

export class UserToProjectRequest {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  public readonly username: string

  @ApiProperty()
  @IsNumber()
  public readonly roleId: number
}

export class UserToProjectResponse {
  @ApiProperty()
  public readonly project: ProjectResponse

  @ApiProperty()
  public readonly users: ProjectUsersResponse
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, MinLength } from 'class-validator'
import { ProjectUsersResponse } from './project-users.api'
import { ProjectResponse } from './project.api'

export class UserToProjectRequest {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  public readonly username: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public readonly roleName?: string
}

export class UserToProjectResponse {
  @ApiProperty()
  public readonly project: ProjectResponse

  @ApiProperty()
  public readonly users: ProjectUsersResponse
}

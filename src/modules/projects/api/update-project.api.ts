import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class UpdateProjectResponse {
  @ApiProperty()
  public readonly id: number

  @ApiProperty()
  public readonly name: string

  @ApiProperty()
  public readonly description: string

  @ApiProperty()
  public readonly updatedAt: string
}

export class UpdateProjectRequest {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @IsOptional()
  public readonly name?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly description?: string
}

import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength, MinLength } from 'class-validator'

export class ChangeTitleProjectResponse {
  @ApiProperty()
  public readonly id: number

  @ApiProperty()
  public readonly title: string

  @ApiProperty()
  public readonly updatedAt: Date
}

export class ChangeTitleProjectRequest {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  public readonly title: string
}

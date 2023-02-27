import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength, MinLength } from 'class-validator'

export class CreateProjectRequest {
  @ApiProperty({
    example: 'My project',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  public readonly title: string

  @ApiProperty({
    example: 'My description',
  })
  @IsString()
  @MinLength(1)
  public readonly description: string
}

export class CreateBoardResponse {
  @ApiProperty()
  public readonly id: number

  @ApiProperty()
  public readonly name: string

  @ApiProperty()
  public readonly createdAt: Date

  @ApiProperty()
  public readonly updatedAt: Date
}

export class CreateProjectResponse {
  @ApiProperty()
  public readonly id: number

  @ApiProperty()
  public readonly title: string

  @ApiProperty()
  public readonly createdAt: Date

  @ApiProperty()
  public readonly updatedAt: Date

  @ApiProperty({ type: CreateBoardResponse })
  public readonly board: CreateBoardResponse
}

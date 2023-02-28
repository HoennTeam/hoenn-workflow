import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { IsNull } from 'typeorm'

export class CreateProjectRequest {
  @ApiProperty({
    example: 'My project',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  public readonly name: string

  @ApiProperty({
    example: 'My description',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly description?: string = ''
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
  public readonly name: string

  @ApiProperty()
  public readonly description: string

  @ApiProperty()
  public readonly createdAt: Date

  @ApiProperty()
  public readonly updatedAt: Date

  @ApiProperty({ type: CreateBoardResponse })
  public readonly board: CreateBoardResponse
}

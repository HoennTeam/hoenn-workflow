import { ApiProperty } from '@nestjs/swagger'

export class FullTaskResponse {
  @ApiProperty()
  public readonly id: number

  @ApiProperty()
  public readonly title: string

  @ApiProperty()
  public readonly description: string

  @ApiProperty()
  public readonly stageId: number

  @ApiProperty()
  public readonly createdAt: string

  @ApiProperty()
  public readonly updatedAt: string
}

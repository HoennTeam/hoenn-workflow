import { ApiProperty } from '@nestjs/swagger'

export class ProjectResponse {
  @ApiProperty()
  public readonly id: number

  @ApiProperty()
  public readonly name: string

  @ApiProperty()
  public readonly description: string

  @ApiProperty()
  public readonly createdAt: string

  @ApiProperty()
  public readonly updatedAt: string
}

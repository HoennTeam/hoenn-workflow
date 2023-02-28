import { ApiProperty } from '@nestjs/swagger'

export class ProjectResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  description: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}

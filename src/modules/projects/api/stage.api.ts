import { ApiProperty } from '@nestjs/swagger'

export class StageResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  createdAt: string

  @ApiProperty()
  updatedAt: string
}

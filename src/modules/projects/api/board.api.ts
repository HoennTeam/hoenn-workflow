import { ApiProperty } from '@nestjs/swagger'

export class BoardResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  isDefault: boolean

  @ApiProperty()
  createdAt: string

  @ApiProperty()
  updatedAt: string
}

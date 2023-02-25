import { ApiProperty } from '@nestjs/swagger'

export class InstanceResponse {
  @ApiProperty()
  public readonly name: string

  @ApiProperty()
  public readonly administratorEmail: string

  @ApiProperty({ example: new Date().toISOString() })
  public readonly createdAt: string

  @ApiProperty({ example: new Date().toISOString() })
  public readonly updatedAt: string
}

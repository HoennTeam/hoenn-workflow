import { ApiProperty } from '@nestjs/swagger'

export class UserResponse {
  @ApiProperty()
  public readonly fullName: string

  @ApiProperty()
  public readonly email: string

  @ApiProperty()
  public readonly createdAt: string

  @ApiProperty()
  public readonly updatedAt: string
}

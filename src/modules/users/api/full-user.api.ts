import { ApiProperty } from '@nestjs/swagger'

export class FullUserResponse {
  @ApiProperty()
  public readonly fullName: string

  @ApiProperty()
  public readonly bio: string

  @ApiProperty()
  public readonly email: string

  @ApiProperty()
  public readonly createdAt: string

  @ApiProperty()
  public readonly updatedAt: string
}

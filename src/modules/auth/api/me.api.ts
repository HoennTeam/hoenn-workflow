import { ApiProperty } from '@nestjs/swagger'

export class MeResponse {
  @ApiProperty()
  public readonly username: string

  @ApiProperty()
  public readonly fullName: string

  @ApiProperty()
  public readonly email: string

  @ApiProperty()
  public readonly roleName: string

  @ApiProperty()
  public readonly permissions: string[]
}

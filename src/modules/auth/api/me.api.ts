import { ApiProperty } from '@nestjs/swagger'

export class MeResponse {
  @ApiProperty()
  public readonly username: string

  @ApiProperty()
  public readonly fullName: string

  @ApiProperty()
  public readonly email: string
}

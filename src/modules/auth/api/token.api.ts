import { ApiProperty } from '@nestjs/swagger'
import { MeResponse } from './me.api'

export class TokenResponse {
  @ApiProperty()
  public readonly token: string

  @ApiProperty()
  public readonly user: MeResponse
}

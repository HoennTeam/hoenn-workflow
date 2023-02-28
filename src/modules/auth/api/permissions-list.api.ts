import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class PermissionsListRequest {
  @ApiProperty({ type: [String] })
  @IsString({ each: true })
  public readonly permissionsNames: string[]
}

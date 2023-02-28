import { ApiProperty } from '@nestjs/swagger'

export class PermissionResponse {
  @ApiProperty()
  public readonly name: string

  @ApiProperty()
  public readonly description: string

  @ApiProperty()
  public readonly isGlobal: boolean

  @ApiProperty()
  public readonly group: string

  @ApiProperty()
  public readonly operation: string

  @ApiProperty()
  public readonly enabled: boolean
}

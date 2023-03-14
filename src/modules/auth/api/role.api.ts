import { ApiProperty } from '@nestjs/swagger'

export class RoleResponse {
  @ApiProperty()
  public readonly name: string

  @ApiProperty()
  public readonly description: string

  @ApiProperty()
  public readonly isGlobal: boolean

  @ApiProperty()
  public readonly isImmutable: boolean

  @ApiProperty()
  public readonly createdAt: string

  @ApiProperty()
  public readonly updatedAt: string
}

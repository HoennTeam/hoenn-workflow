import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class CreateRoleRequest {
  @ApiProperty()
  @IsString()
  public readonly name: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly description?: string

  @ApiProperty()
  @IsBoolean()
  public readonly isGlobal: boolean
}

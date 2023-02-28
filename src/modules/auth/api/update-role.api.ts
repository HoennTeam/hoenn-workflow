import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateRoleRequest {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly name?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly description?: string
}

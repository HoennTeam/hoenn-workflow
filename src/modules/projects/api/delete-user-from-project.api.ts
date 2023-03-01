import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'

export class DeleteUserFromProjectRequest {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  public readonly user: string
}

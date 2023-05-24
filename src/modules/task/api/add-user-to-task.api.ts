import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AddUserToTaskRequest {
  @ApiProperty()
  @IsString()
  public readonly username: string
}

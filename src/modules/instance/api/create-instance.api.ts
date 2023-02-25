import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength } from 'class-validator'
import { CreateUserResponse } from '../../auth/api/create-user.api'
import { InstanceResponse } from './instance.api'

export class CreateInstanceRequest {
  @ApiProperty({
    example: 'My Organization',
  })
  @IsString()
  @MinLength(1)
  public readonly name: string

  @ApiProperty({
    example: 'contact-admin@org.com',
  })
  @IsEmail()
  public readonly administratorEmail: string
}

export class createInstanceResponse {
  @ApiProperty()
  public readonly instance: InstanceResponse

  @ApiProperty()
  public readonly administrator: CreateUserResponse
}

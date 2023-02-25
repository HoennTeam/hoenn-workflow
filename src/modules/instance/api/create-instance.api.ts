import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength } from 'class-validator'

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

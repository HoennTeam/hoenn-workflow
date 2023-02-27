import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength } from 'class-validator'

export class CreateUserRequest {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  public readonly username: string

  @ApiProperty()
  @IsString()
  @MinLength(3)
  public readonly fullName: string

  @ApiProperty()
  @IsEmail()
  public readonly email: string
}

export class CreateUserResponse {
  @ApiProperty()
  public readonly username: string

  @ApiProperty()
  public readonly fullName: string

  @ApiProperty()
  public readonly email: string

  @ApiProperty()
  public readonly password: string

  @ApiProperty({ example: new Date().toISOString() })
  public readonly createdAt: string

  @ApiProperty({ example: new Date().toISOString() })
  public readonly updatedAt: string
}

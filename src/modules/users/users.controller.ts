import { Body, Controller, Post } from '@nestjs/common'
import {
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { ExceptionResponse } from '../../common/response/exception-response'
import { CreateUserRequest, CreateUserResponse } from './api/create-user.api'
import { UsersService } from './users.service'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ description: 'Add new user to the instance' })
  @ApiOkResponse({ type: CreateUserResponse })
  @ApiConflictResponse({ type: ExceptionResponse })
  @Post()
  public async createUser(
    @Body() createUserRequest: CreateUserRequest
  ): Promise<CreateUserResponse> {
    return this.usersService.createUser(createUserRequest)
  }
}

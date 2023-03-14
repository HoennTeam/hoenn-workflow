import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common'
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { ExceptionResponse } from '../../common/response/exception-response'
import { CreateUserRequest, CreateUserResponse } from './api/create-user.api'
import { UserResponse } from './api/user.api'
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

  @ApiOperation({ description: 'Get users' })
  @ApiOkResponse({ type: [UserResponse] })
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Get()
  public async getUsers(): Promise<UserResponse[]> {
    return this.usersService.getUsers()
  }

  @ApiOperation({ description: 'Get user' })
  @ApiOkResponse({ type: UserResponse })
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Get('/:userId')
  public async getUser(
    @Param('userId', ParseIntPipe) id: number
  ): Promise<UserResponse> {
    return this.usersService.getUser(id)
  }
}

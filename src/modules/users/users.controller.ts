import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common'
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { ExceptionResponse } from '../../common/response/exception-response'
import { CreateUserRequest, CreateUserResponse } from './api/create-user.api'
import { FullUserResponse } from './api/full-user.api'
import { UpdateUserRequest } from './api/update-user.api'
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
  @Get('/:username')
  public async getUser(
    @Param('username') username: string
  ): Promise<UserResponse> {
    return this.usersService.getUser(username)
  }

  @ApiOperation({ description: 'Remove user' })
  @ApiOkResponse()
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Delete('/:username')
  public async removeUser(@Param('username') username: string): Promise<void> {
    return this.usersService.removeUser(username)
  }

  @ApiOperation({ description: 'Update user' })
  @ApiOkResponse({ type: FullUserResponse })
  @ApiUnauthorizedResponse({ type: ExceptionResponse })
  @Patch('/:username')
  public async updateProfile(
    @Param('username') username: string,
    @Body() dto: UpdateUserRequest
  ): Promise<FullUserResponse> {
    return this.usersService.updateProfile({
      username,
      ...dto,
    })
  }
}

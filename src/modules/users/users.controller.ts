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
import { UpdateUserRoleRequest } from './api/update-user-role.api'
import { Authorize } from '../../common/decorators/authorize.decorator'
import { PERMISSIONS } from '../../common/const/permissions.const'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Authorize({ permission: PERMISSIONS.USERS.CREATE })
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
  @ApiOkResponse({ type: FullUserResponse })
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Get('/:username')
  public async getUser(
    @Param('username') username: string
  ): Promise<FullUserResponse> {
    return this.usersService.getFullUser(username)
  }

  @Authorize({ permission: PERMISSIONS.USERS.DELETE })
  @ApiOperation({ description: 'Remove user' })
  @ApiOkResponse()
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Delete('/:username')
  public async removeUser(@Param('username') username: string): Promise<void> {
    return this.usersService.removeUser(username)
  }

  @Authorize({ permission: PERMISSIONS.USERS.UPDATE })
  @ApiOperation({ description: 'Update user' })
  @ApiOkResponse({ type: FullUserResponse })
  @ApiUnauthorizedResponse({ type: ExceptionResponse })
  @Patch('/:username')
  public async updateProfile(
    @Param('username') username: string,
    @Body() dto: UpdateUserRequest
  ): Promise<FullUserResponse> {
    return this.usersService.updateUser({
      username,
      ...dto,
    })
  }

  @Authorize({ permission: PERMISSIONS.USERS.UPDATE_ROLE })
  @ApiOperation({ description: 'Update user role' })
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ type: ExceptionResponse })
  @Patch('/:username/role')
  public async updateUserRole(
    @Param('username') username: string,
    @Body() request: UpdateUserRoleRequest
  ): Promise<void> {
    return this.usersService.updateUserRole({
      username,
      ...request,
    })
  }
}

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
import { CreateTaskRequest } from './api/create-task.api'
import { FullTaskResponse } from './api/full-task.api'
import { UpdateTaskRequest } from './api/update-task.api'
import { TasksService } from './tasks.service'

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ description: 'Create task' })
  @ApiOkResponse({ type: FullTaskResponse })
  @ApiConflictResponse({ type: ExceptionResponse })
  @Post()
  public async createUser(
    @Body() createUserRequest: CreateTaskRequest
  ): Promise<FullTaskResponse> {
    return this.tasksService.createTask(createUserRequest)
  }

  @ApiOperation({ description: 'Get full task' })
  @ApiOkResponse({ type: FullTaskResponse })
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Get('/:id')
  public async getUser(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<FullTaskResponse> {
    return this.tasksService.getFullTask(id)
  }

  @ApiOperation({ description: 'Delete task' })
  @ApiOkResponse()
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Delete('/:id')
  public async removeUser(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<void> {
    return this.tasksService.removeTask(id)
  }

  @ApiOperation({ description: 'Update user' })
  @ApiOkResponse({ type: FullTaskResponse })
  @ApiUnauthorizedResponse({ type: ExceptionResponse })
  @Patch('/:id')
  public async updateProfile(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() dto: UpdateTaskRequest
  ): Promise<FullTaskResponse> {
    return this.tasksService.updateTask({
      id,
      ...dto,
    })
  }
}

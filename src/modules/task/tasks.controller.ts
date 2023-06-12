import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
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
import { MoveTaskRequest } from './api/move-task.api'
import { AddUserToTaskRequest } from './api/add-user-to-task.api'
import { Authorize } from '../../common/decorators/authorize.decorator'
import { AuthPayload } from '../../common/interfaces/auth-payload.interface'
import { Payload } from '../../common/decorators/payload.decorator'

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Authorize({})
  @ApiOperation({ description: 'Create task' })
  @ApiOkResponse({ type: FullTaskResponse })
  @ApiConflictResponse({ type: ExceptionResponse })
  @Post()
  public async createTask(
    @Body() createTaskRequest: CreateTaskRequest,
    @Payload() payload: AuthPayload
  ): Promise<FullTaskResponse> {
    return this.tasksService.createTask(createTaskRequest, payload)
  }

  @ApiOperation({ description: 'Get full task' })
  @ApiOkResponse({ type: FullTaskResponse })
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Get('/:id')
  public async getFullTask(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<FullTaskResponse> {
    return this.tasksService.getFullTask(id)
  }

  @Authorize({})
  @ApiOperation({ description: 'Delete task' })
  @ApiOkResponse()
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Delete('/:id')
  public async removeTask(
    @Param('id', new ParseIntPipe()) id: number,
    @Payload() payload: AuthPayload
  ): Promise<void> {
    return this.tasksService.removeTask(id, payload)
  }

  @Authorize({})
  @ApiOperation({ description: 'Update task' })
  @ApiOkResponse({ type: FullTaskResponse })
  @ApiUnauthorizedResponse({ type: ExceptionResponse })
  @Patch('/:id')
  public async updateTask(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateTaskRequest: UpdateTaskRequest,
    @Payload() payload: AuthPayload
  ): Promise<FullTaskResponse> {
    return this.tasksService.updateTask(
      {
        id,
        ...updateTaskRequest,
      },
      payload
    )
  }

  @Authorize({})
  @ApiOperation({ description: 'Move task' })
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ type: ExceptionResponse })
  @Patch('/:id/move')
  public async moveTask(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() moveTaskRequest: MoveTaskRequest,
    @Payload() payload: AuthPayload
  ): Promise<void> {
    return this.tasksService.moveTask(
      {
        id,
        ...moveTaskRequest,
      },
      payload
    )
  }

  @Authorize({})
  @ApiOperation({ description: 'Add user to task' })
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ type: ExceptionResponse })
  @Put('/:id/assignees')
  public async addUserToTask(
    @Param('id', new ParseIntPipe()) taskId: number,
    @Body() addUserToTaskRequest: AddUserToTaskRequest,
    @Payload() payload: AuthPayload
  ): Promise<void> {
    return this.tasksService.addUserToTask(
      {
        taskId,
        ...addUserToTaskRequest,
      },
      payload
    )
  }

  @Authorize({})
  @ApiOperation({ description: 'Remove user from task' })
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ type: ExceptionResponse })
  @Delete('/:id/assignees/:username')
  public async removeUserFromTask(
    @Param('id', new ParseIntPipe()) taskId: number,
    @Param('username') username: string,
    @Payload() payload: AuthPayload
  ): Promise<void> {
    return this.tasksService.removeUserFromTask(
      {
        taskId,
        username,
      },
      payload
    )
  }
}

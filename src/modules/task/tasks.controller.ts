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
import { MoveTaskRequest } from './api/move-task.api'

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ description: 'Create task' })
  @ApiOkResponse({ type: FullTaskResponse })
  @ApiConflictResponse({ type: ExceptionResponse })
  @Post()
  public async createTask(
    @Body() createTaskRequest: CreateTaskRequest
  ): Promise<FullTaskResponse> {
    return this.tasksService.createTask(createTaskRequest)
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

  @ApiOperation({ description: 'Delete task' })
  @ApiOkResponse()
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Delete('/:id')
  public async removeTask(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<void> {
    return this.tasksService.removeTask(id)
  }

  @ApiOperation({ description: 'Update task' })
  @ApiOkResponse({ type: FullTaskResponse })
  @ApiUnauthorizedResponse({ type: ExceptionResponse })
  @Patch('/:id')
  public async updateTask(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateTaskRequest: UpdateTaskRequest
  ): Promise<FullTaskResponse> {
    return this.tasksService.updateTask({
      id,
      ...updateTaskRequest,
    })
  }

  @ApiOperation({ description: 'Move task' })
  @ApiOkResponse({ type: FullTaskResponse })
  @ApiUnauthorizedResponse({ type: ExceptionResponse })
  @Patch('/:id/move')
  public async moveTask(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() moveTaskRequest: MoveTaskRequest
  ): Promise<FullTaskResponse> {
    return this.tasksService.moveTask({
      id,
      ...moveTaskRequest,
    })
  }
}

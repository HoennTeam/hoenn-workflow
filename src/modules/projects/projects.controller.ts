import { ProjectsService } from './projects.service'
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
import { ExceptionResponse } from '../../common/response/exception-response'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import {
  CreateProjectRequest,
  CreateProjectResponse,
} from './api/create-project.api'
import {
  UpdateProjectRequest,
  UpdateProjectResponse,
} from './api/update-project.api'
import { ProjectResponse } from './api/project.api'
import { FullProjectResponse } from './api/full-project.api'
import { BoardResponse } from './api/board.api'
import { FullBoardResponse } from './api/full-board.api'
import { StageResponse } from './api/stage.api'
import {
  AddUserToProjectRequest,
  AddUserToProjectResponse,
} from './api/add-user-to-project.api'
import { AddUserToProjectRequestDto } from './dto/add-user-to-project.dto'
@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({ description: 'Get instance configuration' })
  @ApiOkResponse({ type: ProjectResponse })
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Get()
  public async getProjects(): Promise<ProjectResponse[]> {
    return this.projectsService.getProjects()
  }

  @ApiOperation({ description: 'Get one project' })
  @ApiOkResponse({ type: ProjectResponse })
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Get('/:id')
  public async getProject(
    @Param('id', ParseIntPipe) id: number
  ): Promise<FullProjectResponse> {
    return this.projectsService.getFullProject(id)
  }

  @ApiOperation({ description: 'Create project' })
  @ApiOkResponse({ type: CreateProjectResponse })
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Post()
  public async createProject(
    @Body() createProjectRequest: CreateProjectRequest
  ): Promise<CreateProjectResponse> {
    return this.projectsService.createProject(createProjectRequest)
  }

  @ApiOperation({ description: 'Project archived' })
  @ApiOkResponse()
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Delete('/:id')
  public async removeProject(
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    return this.projectsService.removeProject(id)
  }

  @ApiOperation({ description: 'Update project' })
  @ApiOkResponse({ type: UpdateProjectResponse })
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Patch('/:id')
  public async updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProject: UpdateProjectRequest
  ): Promise<UpdateProjectResponse> {
    return this.projectsService.updateProject(id, updateProject)
  }

  @ApiOperation({ description: 'Get boards' })
  @ApiOkResponse({ type: BoardResponse })
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Get('/:id/boards')
  public async getBoards(
    @Param('id', ParseIntPipe) projectId: number
  ): Promise<BoardResponse[]> {
    return this.projectsService.getBoards(projectId)
  }

  @ApiOperation({ description: 'Get board' })
  @ApiOkResponse({ type: FullBoardResponse })
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Get('/:projectId/boards/:boardId')
  public async getBoard(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('boardId', ParseIntPipe) boardId: number
  ): Promise<FullBoardResponse> {
    return this.projectsService.getFullBoard(projectId, boardId)
  }

  @ApiOperation({ description: 'Get stages' })
  @ApiOkResponse({ type: StageResponse })
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Get('/:projectId/boards/:boardId/stages')
  public async getStages(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('boardId', ParseIntPipe) boardId: number
  ): Promise<StageResponse[]> {
    return this.projectsService.getStages(projectId, boardId)
  }

  @ApiOperation({ description: 'Add user in project' })
  @ApiOkResponse({ type: AddUserToProjectResponse })
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Put('/:projectId')
  public async addUserToProject(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() addUserToProjectDto: AddUserToProjectRequest
  ): Promise<AddUserToProjectResponse> {
    return this.projectsService.addUserToProject(projectId, addUserToProjectDto)
  }
}

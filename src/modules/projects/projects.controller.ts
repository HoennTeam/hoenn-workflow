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
  UserToProjectRequest,
  UserToProjectResponse,
} from './api/user-to-project.api'
import { UserToProjectRequestDto } from './dto/user-to-project.dto'
import { DeleteUserFromProjectDto } from './dto/delete-user-from-project.dto'
import { CreateStageRequest } from './api/create-stage.api'
import { CreateStageDto } from './dto/create-stage.dto'
import { RemoveStageDto } from './dto/delete-stage.dto'
import { UpdateStageDto } from './dto/update-stage.dto'
import { UpdateStageRequest } from './api/update-stage.api'
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

  @ApiOperation({ description: 'Add user to project' })
  @ApiOkResponse({ type: UserToProjectResponse })
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Put('/:projectId/users')
  public async addUserToProject(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() userToProjectRequest: UserToProjectRequest
  ): Promise<UserToProjectResponse> {
    const addUserToProjectDto: UserToProjectRequestDto = {
      projectId: projectId,
      username: userToProjectRequest.username,
      roleId: userToProjectRequest.roleId,
    }
    return this.projectsService.addUserToProject(addUserToProjectDto)
  }

  @ApiOperation({ description: 'Remove user in project' })
  @ApiOkResponse()
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Delete('/:projectId/users/:username')
  public async removeUserFromProject(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('username') username: string
  ): Promise<void> {
    const deleteUserFromProjectDto: DeleteUserFromProjectDto = {
      projectId: projectId,
      username: username,
    }
    return this.projectsService.removeUserFromProject(deleteUserFromProjectDto)
  }

  @ApiOperation({ description: 'Change user role in project' })
  @ApiOkResponse({ type: UserToProjectResponse })
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Patch('/:projectId/users/:username')
  public async changeUserRoleInProject(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('username') username: string,
    @Body('roleId', ParseIntPipe) roleId: number
  ): Promise<UserToProjectResponse> {
    const changeUserRoleInProjectDto: UserToProjectRequestDto = {
      projectId: projectId,
      username: username,
      roleId: roleId,
    }
    return this.projectsService.changeUserRoleInProject(
      changeUserRoleInProjectDto
    )
  }

  @ApiOperation({ description: 'Create stage' })
  @ApiOkResponse({ type: StageResponse })
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Post(':projectId/boards/:boardId/stages')
  public async createStage(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() createStage: CreateStageRequest
  ): Promise<StageResponse> {
    const dto: CreateStageDto = {
      projectId,
      boardId,
      name: createStage.name,
    }
    return this.projectsService.createStage(dto)
  }

  @ApiOperation({ description: 'Remove stage' })
  @ApiOkResponse()
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Delete(':projectId/boards/:boardId/stages/:stageId')
  public async removeStage(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('stageId', ParseIntPipe) stageId: number
  ): Promise<void> {
    const dto: RemoveStageDto = {
      projectId,
      boardId,
      stageId,
    }
    return this.projectsService.removeStage(dto)
  }

  @ApiOperation({ description: 'Update stage' })
  @ApiOkResponse()
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Patch(':projectId/boards/:boardId/stages/:stageId')
  public async updateStage(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('stageId', ParseIntPipe) stageId: number,
    @Body() updateStage: UpdateStageRequest
  ): Promise<StageResponse> {
    const dto: UpdateStageDto = {
      projectId,
      boardId,
      stageId,
      name: updateStage.name,
    }
    return this.projectsService.updateStage(dto)
  }
}

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
} from '@nestjs/common'
import { ExceptionResponse } from '../../common/response/exception-response'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { ProjectResponse } from './api/get-projects.api'
import { GetProjectResponseById } from './api/get-project.api'
import {
  CreateProjectRequest,
  CreateProjectResponse,
} from './api/create-project.api'
import {
  UpdateProjectRequest,
  UpdateProjectResponse,
} from './api/update-project.api'
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
  @ApiOkResponse({ type: GetProjectResponseById })
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Get('/:id')
  public async getProject(
    @Param('id', ParseIntPipe) id: number
  ): Promise<GetProjectResponseById> {
    return this.projectsService.getProject(id)
  }

  @ApiOperation({ description: 'Create project ' })
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

  @ApiOperation({ description: 'Project title changed' })
  @ApiOkResponse({ type: UpdateProjectResponse })
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Patch('/:id')
  public async updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProject: UpdateProjectRequest
  ): Promise<UpdateProjectResponse> {
    return this.projectsService.updateProject(id, updateProject)
  }
}

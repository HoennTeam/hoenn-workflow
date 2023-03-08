import { Body, Controller, Get, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { ExceptionResponse } from '../../common/response/exception-response'
import {
  CreateInstanceRequest,
  CreateInstanceResponse,
} from './api/create-instance.api'
import { InstanceResponse } from './api/instance.api'
import { InstanceService } from './instance.service'

@ApiTags('Instance')
@Controller('instance')
export class InstanceController {
  constructor(private readonly instanceService: InstanceService) {}

  @ApiOperation({ description: 'Get instance configuration' })
  @ApiOkResponse({ type: InstanceResponse })
  @ApiNotFoundResponse({ type: ExceptionResponse })
  @Get()
  public async getInstance(): Promise<InstanceResponse> {
    return this.instanceService.getInstance()
  }

  @ApiOperation({ description: 'Create instance' })
  @ApiOkResponse({ type: InstanceResponse })
  @ApiBadRequestResponse({ type: ExceptionResponse })
  @Post()
  public async createInstance(
    @Body() createInstanceRequest: CreateInstanceRequest
  ): Promise<CreateInstanceResponse> {
    return this.instanceService.createInstance(createInstanceRequest)
  }
}

import { Body, Controller, Get, Patch, Post } from '@nestjs/common'
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
import { UpdateInstanceRequest } from './api/update-instance.api'
import { InstanceService } from './instance.service'
import { Authorize } from '../../common/decorators/authorize.decorator'
import { PERMISSIONS } from '../../common/const/permissions.const'

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

  @Authorize({ permission: PERMISSIONS.INSTANCE.UPDATE })
  @ApiOperation({ description: 'Update instance' })
  @ApiOkResponse({ type: InstanceResponse })
  @ApiBadRequestResponse({ type: ExceptionResponse })
  @Patch()
  public async updateInstance(
    @Body() updateInstanceRequest: UpdateInstanceRequest
  ): Promise<InstanceResponse> {
    return this.instanceService.updateInstance(updateInstanceRequest)
  }
}

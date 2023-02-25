import { Body, Controller, Get, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { ExceptionResponse } from '../../common/response/exception-response'
import { CreateInstanceRequest } from './api/create-instance.api'
import { InstanceResponse } from './api/instance.api'
import { InstanceService } from './instance.service'

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
  ): Promise<InstanceResponse> {
    return this.instanceService.createInstance(createInstanceRequest)
  }
}

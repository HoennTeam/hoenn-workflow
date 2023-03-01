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
import { CreateRoleRequest } from '../api/create-role.api'
import { PermissionResponse } from '../api/permission.api'
import { PermissionsListRequest } from '../api/permissions-list.api'
import { RoleResponse } from '../api/role.api'
import { UpdateRoleRequest } from '../api/update-role.api'
import { RolesService } from '../services/roles.service'

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  public async getRoles(): Promise<RoleResponse[]> {
    return this.rolesService.getRoles()
  }

  @Get(':id')
  public async getRole(
    @Param('id', ParseIntPipe) id: number
  ): Promise<RoleResponse> {
    return this.rolesService.getRole(id)
  }

  @Post()
  public async createRole(
    @Body() data: CreateRoleRequest
  ): Promise<RoleResponse> {
    return this.rolesService.createRole(data)
  }

  @Patch(':id')
  public async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateRoleRequest
  ): Promise<RoleResponse> {
    return this.rolesService.updateRole({
      id,
      ...data,
    })
  }

  @Delete(':id')
  public async deleteRole(
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    return this.rolesService.deleteRole(id)
  }

  @Get(':id/permissions')
  public async getPermissions(
    @Param('id', ParseIntPipe) id: number
  ): Promise<PermissionResponse[]> {
    return this.rolesService.getPermissions(id)
  }

  @Put(':id/permissions')
  public async addPermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: PermissionsListRequest
  ): Promise<void> {
    return this.rolesService.addPermissions(id, data.permissionsNames)
  }

  @Delete(':id/permissions')
  public async removePermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: PermissionsListRequest
  ): Promise<void> {
    return this.rolesService.removePermissions(id, data.permissionsNames)
  }
}

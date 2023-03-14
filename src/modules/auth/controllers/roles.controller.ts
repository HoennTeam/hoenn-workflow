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

  @Get(':name')
  public async getRole(@Param('name') name: string): Promise<RoleResponse> {
    return this.rolesService.getRole(name)
  }

  @Post()
  public async createRole(
    @Body() data: CreateRoleRequest
  ): Promise<RoleResponse> {
    return this.rolesService.createRole(data)
  }

  @Patch(':name')
  public async updateRole(
    @Param('name') name: string,
    @Body() data: UpdateRoleRequest
  ): Promise<RoleResponse> {
    return this.rolesService.updateRole({
      name,
      ...data,
    })
  }

  @Delete(':name')
  public async deleteRole(@Param('name') name: string): Promise<void> {
    return this.rolesService.deleteRole(name)
  }

  @Get(':name/permissions')
  public async getPermissions(
    @Param('name') roleName: string
  ): Promise<PermissionResponse[]> {
    return this.rolesService.getPermissions(roleName)
  }

  @Put(':name/permissions')
  public async addPermissions(
    @Param('name') roleName: string,
    @Body() data: PermissionsListRequest
  ): Promise<void> {
    return this.rolesService.addPermissions(roleName, data.permissionsNames)
  }

  @Delete(':name/permissions')
  public async removePermissions(
    @Param('name') roleName: string,
    @Body() data: PermissionsListRequest
  ): Promise<void> {
    return this.rolesService.removePermissions(roleName, data.permissionsNames)
  }
}

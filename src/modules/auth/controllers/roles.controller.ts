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
import { Authorize } from '../../../common/decorators/authorize.decorator'
import { PERMISSIONS } from '../../../common/const/permissions.const'

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Authorize({ permission: PERMISSIONS.ROLES.READ })
  @Get()
  public async getRoles(): Promise<RoleResponse[]> {
    return this.rolesService.getRoles()
  }

  @Authorize({ permission: PERMISSIONS.ROLES.READ })
  @Get(':name')
  public async getRole(@Param('name') name: string): Promise<RoleResponse> {
    return this.rolesService.getRole(name)
  }

  @Authorize({ permission: PERMISSIONS.ROLES.CREATE })
  @Post()
  public async createRole(
    @Body() data: CreateRoleRequest
  ): Promise<RoleResponse> {
    return this.rolesService.createRole(data)
  }

  @Authorize({ permission: PERMISSIONS.ROLES.UPDATE })
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

  @Authorize({ permission: PERMISSIONS.ROLES.DELETE })
  @Delete(':name')
  public async deleteRole(@Param('name') name: string): Promise<void> {
    return this.rolesService.deleteRole(name)
  }

  @Authorize({ permission: PERMISSIONS.ROLES.READ })
  @Get(':name/permissions')
  public async getPermissions(
    @Param('name') roleName: string
  ): Promise<PermissionResponse[]> {
    return this.rolesService.getPermissions(roleName)
  }

  @Authorize({ permission: PERMISSIONS.ROLES.CREATE })
  @Put(':name/permissions')
  public async addPermissions(
    @Param('name') roleName: string,
    @Body() data: PermissionsListRequest
  ): Promise<void> {
    return this.rolesService.addPermissions(roleName, data.permissionsNames)
  }

  @Authorize({ permission: PERMISSIONS.ROLES.DELETE })
  @Delete(':name/permissions')
  public async removePermissions(
    @Param('name') roleName: string,
    @Body() data: PermissionsListRequest
  ): Promise<void> {
    return this.rolesService.removePermissions(roleName, data.permissionsNames)
  }
}

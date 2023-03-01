import { HttpStatus, Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { AppException } from '../../../common/exceptions/app.exception'
import { Permission } from '../../../entities/permission'
import { Role } from '../../../entities/role'

@Injectable()
export class PermissionsService {
  constructor(private readonly connection: DataSource) {}

  private async getRoleWithPermissions(roleName: string): Promise<Role> {
    const role = await this.connection
      .createQueryBuilder(Role, 'role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .where('role.name = :roleName', { roleName })
      .getOne()

    if (!role) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Role not found', {
        roleName,
      })
    }

    return role
  }

  public async hasGlobalPermission(
    username: string,
    permissionName: string
  ): Promise<boolean> {
    const permission = await this.connection
      .createQueryBuilder(Permission, 'permission')
      .leftJoin('permission.roles', 'roles')
      .leftJoin('roles.users', 'users')
      .where('users.username = :username', { username })
      .andWhere('permission.name = :permissionName', { permissionName })
      .getOne()

    return !!permission
  }

  public async hasProjectPermission(
    username: string,
    projectId: number,
    permissionName: string
  ): Promise<boolean> {
    const permission = await this.connection
      .createQueryBuilder(Permission, 'permission')
      .leftJoin('permission.roles', 'roles')
      .leftJoin('roles.projectsUsers', 'projectsUsers')
      .leftJoin('projectsUsers.project', 'project')
      .leftJoin('projectsUsers.user', 'user')
      .where('user.username = :username', { username })
      .andWhere('project.id = :projectId', { projectId })
      .andWhere('permission.name = :permissionName', { permissionName })
      .getOne()

    return !!permission
  }
}

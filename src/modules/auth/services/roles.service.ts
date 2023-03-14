import { HttpStatus, Injectable } from '@nestjs/common'
import { DataSource, In } from 'typeorm'
import { AppException } from '../../../common/exceptions/app.exception'
import { Permission } from '../../../entities/permission'
import { Role } from '../../../entities/role'
import { CreateRoleDto } from '../dto/create-role.dto'
import { PermissionDto } from '../dto/permission.dto'
import { RoleDto } from '../dto/role.dto'
import { UpdateRoleDto } from '../dto/update-role.dto'

@Injectable()
export class RolesService {
  constructor(private readonly connection: DataSource) {}

  public async getRoles(): Promise<RoleDto[]> {
    const roles = await this.connection.getRepository(Role).find()

    return roles.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      isGlobal: r.isGlobal,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }))
  }

  public async getRole(roleId: number): Promise<RoleDto> {
    const role = await this.connection.getRepository(Role).findOne({
      where: {
        id: roleId,
      },
    })

    if (!role) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Role not found', {
        id: roleId,
      })
    }

    return {
      id: role.id,
      name: role.name,
      description: role.description,
      isGlobal: role.isGlobal,
      createdAt: role.createdAt.toISOString(),
      updatedAt: role.updatedAt.toISOString(),
    }
  }

  public async createRole(dto: CreateRoleDto): Promise<RoleDto> {
    const role = new Role({
      name: dto.name,
      description: dto.description || '',
      isGlobal: dto.isGlobal,
    })

    await this.connection.getRepository(Role).save(role)

    return {
      id: role.id,
      name: role.name,
      description: role.description,
      isGlobal: role.isGlobal,
      createdAt: role.createdAt.toISOString(),
      updatedAt: role.updatedAt.toISOString(),
    }
  }

  public async updateRole(dto: UpdateRoleDto): Promise<RoleDto> {
    const role = await this.connection.getRepository(Role).findOne({
      where: {
        id: dto.id,
      },
    })

    if (!role) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Role not found', {
        id: dto.id,
      })
    }

    role.name = dto.name ?? role.name
    role.description = dto.description ?? role.description

    await this.connection.getRepository(Role).save(role)

    return {
      id: role.id,
      name: role.name,
      description: role.description,
      isGlobal: role.isGlobal,
      createdAt: role.createdAt.toISOString(),
      updatedAt: role.updatedAt.toISOString(),
    }
  }

  public async deleteRole(roleId: number): Promise<void> {
    const role = await this.connection.getRepository(Role).findOne({
      where: {
        id: roleId,
      },
    })

    if (!role) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Role not found', {
        id: roleId,
      })
    }

    await this.connection.getRepository(Role).softRemove(role)
  }

  public async getPermissions(roleId: number): Promise<PermissionDto[]> {
    const permissions: (Permission & { enabled: boolean })[] =
      await this.connection
        .createQueryBuilder(Permission, 'permission')
        .select('permission.*')
        .addSelect('enabled.id IS NOT NULL', 'enabled')
        .leftJoin(Role, 'role', 'TRUE')
        .leftJoin(
          (qb) =>
            qb
              .subQuery()
              .from(Permission, 'permission')
              .select('permission.id', 'id')
              .leftJoin('permission.roles', 'roles')
              .where('roles.id = :roleId', { roleId }),
          'enabled',
          'enabled.id = permission.id'
        )
        .where('role.id = :roleId', { roleId })
        .andWhere('permission.isGlobal = role.isGlobal')
        .orderBy('permission.group', 'ASC')
        .addOrderBy('permission.operation', 'ASC')
        .getRawMany()

    return permissions.map((p) => ({
      name: p.name,
      description: p.description,
      isGlobal: p.isGlobal,
      group: p.group,
      operation: p.operation,
      enabled: p.enabled,
    }))
  }

  public async addPermissions(
    roleId: number,
    permissionsNames: string[]
  ): Promise<void> {
    const role = await this.connection.getRepository(Role).findOne({
      where: { id: roleId },
      relations: ['permissions'],
    })

    if (!role) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Role not found', {
        id: roleId,
      })
    }

    const permissions = await this.connection.getRepository(Permission).find({
      where: {
        name: In(permissionsNames),
      },
    })

    role.permissions.push(...permissions)

    await this.connection.getRepository(Role).save(role)
  }

  public async removePermissions(
    roleId: number,
    permissionsNames: string[]
  ): Promise<void> {
    const role = await this.connection.getRepository(Role).findOne({
      where: { id: roleId },
      relations: ['permissions'],
    })

    if (!role) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Role not found', {
        id: roleId,
      })
    }

    role.permissions = role.permissions.filter(
      (p) => !permissionsNames.includes(p.name)
    )

    await this.connection.getRepository(Role).save(role)
  }
}

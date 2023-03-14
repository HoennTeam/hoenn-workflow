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
    const roles = await this.connection.getRepository(Role).find({
      order: {
        isGlobal: 'DESC',
        name: 'ASC',
      },
    })

    return roles.map((r) => ({
      name: r.name,
      description: r.description,
      isGlobal: r.isGlobal,
      isImmutable: r.isImmutable,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }))
  }

  public async getRole(name: string): Promise<RoleDto> {
    const role = await this.connection.getRepository(Role).findOne({
      where: { name },
    })

    if (!role) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Role not found', {
        name,
      })
    }

    return {
      name: role.name,
      description: role.description,
      isGlobal: role.isGlobal,
      isImmutable: role.isImmutable,
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
      name: role.name,
      description: role.description,
      isGlobal: role.isGlobal,
      isImmutable: role.isImmutable,
      createdAt: role.createdAt.toISOString(),
      updatedAt: role.updatedAt.toISOString(),
    }
  }

  public async updateRole(dto: UpdateRoleDto): Promise<RoleDto> {
    const role = await this.connection.getRepository(Role).findOne({
      where: { name: dto.name },
    })

    if (!role) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Role not found', {
        name: dto.name,
      })
    }

    if (role.isImmutable) {
      throw new AppException(HttpStatus.BAD_REQUEST, 'This role is immutable')
    }

    role.description = dto.description ?? role.description

    await this.connection.getRepository(Role).save(role)

    return {
      name: role.name,
      description: role.description,
      isGlobal: role.isGlobal,
      isImmutable: role.isImmutable,
      createdAt: role.createdAt.toISOString(),
      updatedAt: role.updatedAt.toISOString(),
    }
  }

  public async deleteRole(name: string): Promise<void> {
    const role = await this.connection.getRepository(Role).findOne({
      where: { name },
    })

    if (!role) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Role not found', {
        name,
      })
    }

    if (role.isImmutable) {
      throw new AppException(HttpStatus.BAD_REQUEST, 'This role is immutable')
    }

    await this.connection.getRepository(Role).softRemove(role)
  }

  public async getPermissions(roleName: string): Promise<PermissionDto[]> {
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
              .where('roles.name = :roleName', { roleName }),
          'enabled',
          'enabled.id = permission.id'
        )
        .where('role.name = :roleName', { roleName })
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
    roleName: string,
    permissionsNames: string[]
  ): Promise<void> {
    const role = await this.connection.getRepository(Role).findOne({
      where: { name: roleName },
      relations: ['permissions'],
    })

    if (!role) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Role not found', {
        name: roleName,
      })
    }

    if (role.isImmutable) {
      throw new AppException(HttpStatus.BAD_REQUEST, 'This role is immutable')
    }

    const permissions = await this.connection.getRepository(Permission).find({
      where: {
        name: In(permissionsNames),
        isGlobal: role.isGlobal,
      },
    })

    role.permissions.push(...permissions)

    await this.connection.getRepository(Role).save(role)
  }

  public async removePermissions(
    roleName: string,
    permissionsNames: string[]
  ): Promise<void> {
    const role = await this.connection.getRepository(Role).findOne({
      where: { name: roleName },
      relations: ['permissions'],
    })

    if (!role) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Role not found', {
        name: roleName,
      })
    }

    if (role.isImmutable) {
      throw new AppException(HttpStatus.BAD_REQUEST, 'This role is immutable')
    }

    role.permissions = role.permissions.filter(
      (p) => !permissionsNames.includes(p.name)
    )

    await this.connection.getRepository(Role).save(role)
  }
}

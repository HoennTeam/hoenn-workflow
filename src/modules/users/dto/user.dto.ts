import { RoleDto } from 'src/modules/auth/dto/role.dto'

export interface UserDto {
  readonly id: number
  readonly fullName: string
  readonly email: string
  readonly createdAt: string
  readonly updatedAt: string
}

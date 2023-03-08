import { RoleDto } from '../../../modules/auth/dto/role.dto'
import { UserDto } from '../../../modules/users/dto/user.dto'

export interface ProjectUsersDto {
  readonly user: UserDto
  readonly role: RoleDto
}

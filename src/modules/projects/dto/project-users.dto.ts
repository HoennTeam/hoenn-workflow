import { RoleDto } from 'src/modules/auth/dto/role.dto'
import { UserDto } from 'src/modules/users/dto/user.dto'

export interface ProjectUsersDto {
  readonly user: UserDto
  readonly role: RoleDto
}

import { ApiProperty } from '@nestjs/swagger'
import { RoleResponse } from '../../../modules/auth/api/role.api'
import { UserResponse } from '../../../modules/users/api/user.api'

export class ProjectUsersResponse {
  @ApiProperty()
  public readonly user: UserResponse

  @ApiProperty()
  public readonly role: RoleResponse
}

import { ApiProperty } from '@nestjs/swagger'
import { RoleResponse } from 'src/modules/auth/api/role.api'
import { UserResponse } from 'src/modules/users/api/user.api'

export class ProjectUsersResponse {
  @ApiProperty()
  public readonly user: UserResponse

  @ApiProperty()
  public readonly role: RoleResponse
}

import { UserDto } from 'src/modules/users/dto/user.dto'
import { BoardDto } from './board.dto'
import { ProjectUsersDto } from './project-users.dto'

export interface FullProjectDto {
  readonly id: number
  readonly name: string
  readonly description: string
  readonly createdAt: string
  readonly updatedAt: string
  readonly boards: BoardDto[]
  readonly users: ProjectUsersDto[]
}

import { CreateUserOutDto } from '../../auth/dto/create-user.dto'
import { InstanceDto } from './instance.dto'

export interface CreateInstanceDto {
  readonly name: string
  readonly administratorEmail: string
}

export interface CreateInstanceOutDto {
  readonly instance: InstanceDto
  readonly administrator: CreateUserOutDto
}

import { MeDto } from './me.dto'

export interface TokenDto {
  readonly token: string
  readonly user: MeDto
}

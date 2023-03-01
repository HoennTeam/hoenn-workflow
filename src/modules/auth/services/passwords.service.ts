import { Injectable } from '@nestjs/common'
import { Config } from '../../../core/config'
import * as bcrypt from 'bcrypt'

@Injectable()
export class PasswordsService {
  constructor(private readonly config: Config) {}

  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.config.passwords.saltRounds)
  }

  public async validatePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}

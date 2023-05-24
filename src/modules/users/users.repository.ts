import { HttpStatus, Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { User } from '../../entities/user'
import { AppException } from '../../common/exceptions/app.exception'

@Injectable()
export class UsersRepository {
  constructor(private readonly connection: DataSource) {}

  public async getUserIfExists(username: string): Promise<User> {
    const user = await this.connection
      .createQueryBuilder(User, 'user')
      .where('user.username = :username', { username })
      .getOne()

    if (!user) {
      throw new AppException(HttpStatus.NOT_FOUND, 'User not found', {
        username,
      })
    }

    return user
  }
}

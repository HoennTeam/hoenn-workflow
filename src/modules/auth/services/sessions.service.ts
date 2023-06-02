import { Inject, Injectable } from '@nestjs/common'
import { randomBytes } from 'crypto'
import { Redis } from 'ioredis'
import { SESSIONS_NAMESPACE } from '../../../common/const/redis-namespaces.const'
import { AuthPayload } from '../../../common/interfaces/auth-payload.interface'
import { Config } from '../../../core/config'
import { REDIS_KEY } from '../../../core/redis/redis.const'

@Injectable()
export class SessionsService {
  constructor(
    private readonly config: Config,
    @Inject(REDIS_KEY)
    private readonly redisClient: Redis
  ) {}

  public async getSession(sessionId: string): Promise<AuthPayload | undefined> {
    const sessionData = await this.redisClient.get(
      `${SESSIONS_NAMESPACE}:${sessionId}`
    )

    if (!sessionData) {
      return
    }

    return JSON.parse(sessionData)
  }

  public async createSession(payload: AuthPayload): Promise<string> {
    const sessionId = this.generateSessionId()

    await this.redisClient.set(
      `${SESSIONS_NAMESPACE}:${sessionId}`,
      JSON.stringify(payload),
      'EX',
      this.config.sessions.expiresSeconds
    )

    return sessionId
  }

  private generateSessionId(): string {
    return `sid.${randomBytes(this.config.sessions.idLength).toString(
      'base64url'
    )}`
  }
}

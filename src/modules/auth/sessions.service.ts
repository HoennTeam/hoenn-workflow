import { Injectable } from '@nestjs/common'
import { randomBytes } from 'crypto'
import { AuthPayload } from '../../common/interfaces/auth-payload.interface'
import { Config } from '../../core/config'

const sessions: Record<string, AuthPayload> = {
  sam: {
    id: 1,
    username: 'sam!!',
  },
}

@Injectable()
export class SessionsService {
  constructor(private readonly config: Config) {}

  public async getSession(sessionId: string): Promise<AuthPayload | undefined> {
    return sessions[sessionId]
  }

  public async createSession(payload: AuthPayload): Promise<string> {
    const sessionId = this.generateSessionId()
    sessions[sessionId] = payload
    return sessionId
  }

  private generateSessionId(): string {
    return `sid.${randomBytes(this.config.sessions.idLength).toString(
      'base64url'
    )}`
  }
}

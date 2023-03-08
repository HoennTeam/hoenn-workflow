import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule } from '../../../core/config/config.module'
import { REDIS_KEY } from '../../../core/redis/redis.const'
import { SessionsService } from './sessions.service'

describe('SessionsService', () => {
  let service: SessionsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [SessionsService, { provide: REDIS_KEY, useValue: {} }],
    }).compile()

    service = module.get<SessionsService>(SessionsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})

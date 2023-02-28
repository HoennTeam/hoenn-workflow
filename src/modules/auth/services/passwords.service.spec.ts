import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule } from '../../core/config/config.module'
import { LoggerModule } from '../../core/logger/logger.module'
import { PasswordsService } from './passwords.service'

describe('PasswordsService', () => {
  let service: PasswordsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, LoggerModule],
      providers: [PasswordsService],
    }).compile()

    service = module.get<PasswordsService>(PasswordsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})

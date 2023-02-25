import { Test, TestingModule } from '@nestjs/testing'
import { DataSource } from 'typeorm'
import { ConfigModule } from '../../core/config/config.module'
import { LoggerModule } from '../../core/logger/logger.module'
import { InstanceService } from './instance.service'

describe('InstanceService', () => {
  let service: InstanceService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, LoggerModule],
      providers: [InstanceService, { provide: DataSource, useValue: {} }],
    }).compile()

    service = module.get<InstanceService>(InstanceService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})

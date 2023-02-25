import { Test, TestingModule } from '@nestjs/testing'
import { DataSource } from 'typeorm'
import { ConfigModule } from '../../core/config/config.module'
import { LoggerModule } from '../../core/logger/logger.module'
import { InstanceController } from './instance.controller'
import { InstanceService } from './instance.service'

describe('InstanceController', () => {
  let controller: InstanceController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, ConfigModule],
      controllers: [InstanceController],
      providers: [
        { provide: InstanceService, useValue: {} },
        { provide: DataSource, useValue: {} },
      ],
    }).compile()

    controller = module.get<InstanceController>(InstanceController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

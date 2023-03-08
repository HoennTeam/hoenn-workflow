import { Test, TestingModule } from '@nestjs/testing'
import { DataSource } from 'typeorm'
import { RolesService } from './roles.service'

describe('RolesService', () => {
  let service: RolesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesService, { provide: DataSource, useValue: {} }],
    }).compile()

    service = module.get<RolesService>(RolesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})

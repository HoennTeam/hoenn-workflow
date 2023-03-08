import { Test, TestingModule } from '@nestjs/testing'
import { DataSource } from 'typeorm'
import { PermissionsService } from './permissions.service'

describe('PermissionsService', () => {
  let service: PermissionsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionsService, { provide: DataSource, useValue: {} }],
    }).compile()

    service = module.get<PermissionsService>(PermissionsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})

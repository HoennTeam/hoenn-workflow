import { HttpStatus, Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { AppException } from '../../common/exceptions/app.exception'
import { Logger } from '../../core/logger'
import { Instance } from '../../entities/Instance'
import { CreateInstanceDto } from './dto/create-instance.dto'
import { InstanceDto } from './dto/instance.dto'

@Injectable()
export class InstanceService {
  constructor(
    private readonly logger: Logger,
    private readonly connection: DataSource
  ) {}

  public async getInstance(): Promise<InstanceDto> {
    const [instance] = await this.connection
      .createEntityManager()
      .find(Instance, { take: 1 })

    if (!instance) {
      throw new AppException(
        HttpStatus.NOT_FOUND,
        'Your instance is not set up yet'
      )
    }

    return {
      name: instance.name,
      administratorEmail: instance.administratorEmail,
      createdAt: instance.createdAt.toISOString(),
      updatedAt: instance.updatedAt.toISOString(),
    }
  }

  public async createInstance(dto: CreateInstanceDto): Promise<InstanceDto> {
    const [existingInstance] = await this.connection
      .createEntityManager()
      .find(Instance, { take: 1 })

    if (existingInstance) {
      throw new AppException(
        HttpStatus.BAD_REQUEST,
        'Instance is already setup'
      )
    }

    const newInstance = new Instance({
      name: dto.name,
      administratorEmail: dto.administratorEmail,
    })

    await this.connection.createEntityManager().save(newInstance)

    this.logger.info('Organization instance successfully setup', {
      instance: newInstance,
    })

    return {
      name: newInstance.name,
      administratorEmail: newInstance.administratorEmail,
      createdAt: newInstance.createdAt.toISOString(),
      updatedAt: newInstance.updatedAt.toISOString(),
    }
  }
}

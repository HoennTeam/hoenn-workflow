import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { AppException } from '../../common/exceptions/app.exception'
import { Config } from '../../core/config'
import { Logger } from '../../core/logger'
import { Instance } from '../../entities/instance'
import { UsersService } from '../users/users.service'
import {
  CreateInstanceDto,
  CreateInstanceOutDto,
} from './dto/create-instance.dto'
import { InstanceDto } from './dto/instance.dto'
import { UpdateInstanceDto } from './dto/update-instance.dto'

@Injectable()
export class InstanceService {
  constructor(
    private readonly logger: Logger,
    private readonly config: Config,
    private readonly connection: DataSource,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService
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

  public async createInstance(
    dto: CreateInstanceDto
  ): Promise<CreateInstanceOutDto> {
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

    const administrator = await this.usersService.createSystemAdmin(
      dto.administratorEmail
    )

    this.logger.info('Organization instance successfully setup', {
      instance: newInstance,
    })

    return {
      instance: {
        name: newInstance.name,
        administratorEmail: newInstance.administratorEmail,
        createdAt: newInstance.createdAt.toISOString(),
        updatedAt: newInstance.updatedAt.toISOString(),
      },
      administrator,
    }
  }

  public async updateInstance(dto: UpdateInstanceDto): Promise<InstanceDto> {
    const [instance] = await this.connection
      .createEntityManager()
      .find(Instance, { take: 1 })

    if (!instance) {
      throw new AppException(
        HttpStatus.NOT_FOUND,
        'Your instance is not set up yet'
      )
    }

    Object.assign(instance, {
      name: dto.name ?? instance.name,
      administratorEmail: dto.administratorEmail ?? instance.administratorEmail,
    })

    await this.connection.getRepository(Instance).save(instance)

    return {
      name: instance.name,
      administratorEmail: instance.administratorEmail,
      createdAt: instance.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
}

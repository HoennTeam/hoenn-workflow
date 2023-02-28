import {
  DynamicModule,
  FactoryProvider,
  Global,
  Module,
  ModuleMetadata,
} from '@nestjs/common'
import IORedis, { Redis, RedisOptions } from 'ioredis'
import { REDIS_KEY } from './redis.const'

type RedisModuleOptions = {
  connectionOptions: RedisOptions
  onClientReady?: (client: Redis) => void
}

type RedisAsyncModuleOptions = {
  useFactory: (
    ...args: any[]
  ) => Promise<RedisModuleOptions> | RedisModuleOptions
} & Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider, 'inject'>

@Global()
@Module({})
export class RedisModule {
  public static async forRootAsync({
    useFactory,
    imports,
    inject,
  }: RedisAsyncModuleOptions): Promise<DynamicModule> {
    const redisProvider = {
      provide: REDIS_KEY,
      useFactory: async (...args) => {
        const { connectionOptions, onClientReady } = await useFactory(...args)

        const client = await new IORedis(connectionOptions)

        onClientReady?.(client)

        return client
      },
      inject,
    }

    return {
      module: RedisModule,
      imports,
      providers: [redisProvider],
      exports: [redisProvider],
    }
  }
}

import { CACHE_MANAGER, Cache, CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { cacheStorageModuleFactory } from 'src/engine/core-modules/cache-storage/cache-storage.module-factory';
import { FlushCacheCommand } from 'src/engine/core-modules/cache-storage/commands/flush-cache.command';
import { CacheStorageService } from 'src/engine/core-modules/cache-storage/services/cache-storage.service';
import { CacheStorageNamespace } from 'src/engine/core-modules/cache-storage/types/cache-storage-namespace.enum';
import { IntegraCoreConfigService } from 'src/engine/core-modules/integracore-config/integracore-config.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: cacheStorageModuleFactory,
      inject: [IntegraCoreConfigService],
    }),
  ],
  providers: [
    ...Object.values(CacheStorageNamespace).map((cacheStorageNamespace) => ({
      provide: cacheStorageNamespace,
      useFactory: (
        cacheManager: Cache,
        integracoreConfigService: IntegraCoreConfigService,
      ) => {
        return new CacheStorageService(
          cacheManager,
          cacheStorageNamespace,
          integracoreConfigService.get('REDIS_CACHE_PREFIX'),
        );
      },
      inject: [CACHE_MANAGER, IntegraCoreConfigService],
    })),
    FlushCacheCommand,
  ],
  exports: Object.values(CacheStorageNamespace),
})
export class CacheStorageModule {}

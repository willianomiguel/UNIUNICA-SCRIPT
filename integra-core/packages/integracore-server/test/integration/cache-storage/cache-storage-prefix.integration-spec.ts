import { CACHE_MANAGER, type Cache, CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';

import { randomUUID } from 'crypto';

import { cacheStorageModuleFactory } from 'src/engine/core-modules/cache-storage/cache-storage.module-factory';
import { FlushCacheCommand } from 'src/engine/core-modules/cache-storage/commands/flush-cache.command';
import { CacheStorageService } from 'src/engine/core-modules/cache-storage/services/cache-storage.service';
import { CacheStorageNamespace } from 'src/engine/core-modules/cache-storage/types/cache-storage-namespace.enum';
import { ConfigVariables } from 'src/engine/core-modules/integracore-config/config-variables';
import { CONFIG_VARIABLES_INSTANCE_TOKEN } from 'src/engine/core-modules/integracore-config/constants/config-variables-instance-tokens.constants';
import { EnvironmentConfigDriver } from 'src/engine/core-modules/integracore-config/drivers/environment-config.driver';
import { IntegraCoreConfigService } from 'src/engine/core-modules/integracore-config/integracore-config.service';

describe('Cache storage prefix', () => {
  let cacheModule: TestingModule;
  let cache: Cache;
  let entriesToClean: { storage: CacheStorageService; key: string }[];

  beforeAll(async () => {
    cacheModule = await Test.createTestingModule({
      imports: [
        CacheModule.registerAsync({
          useFactory: cacheStorageModuleFactory,
          inject: [IntegraCoreConfigService],
          extraProviders: [
            {
              provide: ConfigService,
              useValue: new ConfigService({
                REDIS_URL: process.env.REDIS_URL,
                CACHE_STORAGE_TTL: 60,
                IS_CONFIG_VARIABLES_IN_DB_ENABLED: false,
              }),
            },
            {
              provide: CONFIG_VARIABLES_INSTANCE_TOKEN,
              useValue: new ConfigVariables(),
            },
            EnvironmentConfigDriver,
            IntegraCoreConfigService,
          ],
        }),
      ],
    }).compile();

    cache = cacheModule.get<Cache>(CACHE_MANAGER);
  });

  beforeEach(() => {
    entriesToClean = [];
  });

  afterEach(async () => {
    await Promise.all(
      entriesToClean.map(({ storage, key }) => storage.del(key)),
    );
  });

  afterAll(async () => {
    await cacheModule.close();
  });

  describe.each([
    { prefix: '', otherPrefix: '{other-cache}' },
    { prefix: '{integracore-cache}', otherPrefix: '{other-cache}' },
    { prefix: '{integracore[prod]}', otherPrefix: '{integracorep}' },
    { prefix: '{integracore*}', otherPrefix: '{integracore-other}' },
    { prefix: '{integracore?}', otherPrefix: '{integracoreX}' },
    { prefix: '{integracore\\prod}', otherPrefix: '{integracoreprod}' },
    { prefix: '{integracore]prod}', otherPrefix: '{integracoreprod}' },
  ])('cache:flush with prefix "$prefix"', ({ prefix, otherPrefix }) => {
    let module: TestingModule;

    beforeAll(async () => {
      module = await Test.createTestingModule({
        providers: [
          { provide: CACHE_MANAGER, useValue: cache },
          {
            provide: ConfigService,
            useValue: new ConfigService({
              REDIS_CACHE_PREFIX: prefix,
              IS_CONFIG_VARIABLES_IN_DB_ENABLED: false,
            }),
          },
          {
            provide: CONFIG_VARIABLES_INSTANCE_TOKEN,
            useValue: new ConfigVariables(),
          },
          EnvironmentConfigDriver,
          IntegraCoreConfigService,
          FlushCacheCommand,
        ],
      }).compile();
    });

    afterAll(async () => {
      await module.close();
    });

    it('matches the suffix pattern while preserving other prefixes and namespaces', async () => {
      const storage = new CacheStorageService(
        cache,
        CacheStorageNamespace.EngineWorkspace,
        prefix,
      );
      const otherPrefixStorage = new CacheStorageService(
        cache,
        CacheStorageNamespace.EngineWorkspace,
        otherPrefix,
      );
      const otherNamespaceStorage = new CacheStorageService(
        cache,
        CacheStorageNamespace.EngineCoreEntity,
        prefix,
      );
      const keyRoot = `cache-prefix:${randomUUID()}`;
      const matchingKeys = [`${keyRoot}:a1:data`, `${keyRoot}:b2:data`];
      const nonMatchingKey = `${keyRoot}:c3:data`;

      entriesToClean = [
        ...[...matchingKeys, nonMatchingKey].map((key) => ({ storage, key })),
        { storage: otherPrefixStorage, key: matchingKeys[0] },
        { storage: otherNamespaceStorage, key: matchingKeys[0] },
      ];
      await Promise.all(
        entriesToClean.map(({ storage: entryStorage, key }) =>
          entryStorage.set(key, 'cached'),
        ),
      );

      await module.get(FlushCacheCommand).run([], {
        namespace: CacheStorageNamespace.EngineWorkspace,
        pattern: `${keyRoot}:[ab]?:data`,
      });

      expect(await storage.mget(matchingKeys)).toEqual([undefined, undefined]);
      expect(await storage.get(nonMatchingKey)).toBe('cached');
      expect(await otherPrefixStorage.get(matchingKeys[0])).toBe('cached');
      expect(await otherNamespaceStorage.get(matchingKeys[0])).toBe('cached');
    });
  });
});

import { CacheStorageNamespace } from 'src/engine/core-modules/cache-storage/types/cache-storage-namespace.enum';
import { getCacheStorageKey } from 'src/engine/core-modules/cache-storage/utils/get-cache-storage-key.util';

describe('getCacheStorageKey', () => {
  it.each([
    {
      keyPrefix: undefined,
      isTestEnvironment: false,
      expectedKey: 'engine:workspace:flatObjectMetadataMaps:123:hash',
    },
    {
      keyPrefix: '',
      isTestEnvironment: false,
      expectedKey: 'engine:workspace:flatObjectMetadataMaps:123:hash',
    },
    {
      keyPrefix: '{integracore-cache}',
      isTestEnvironment: false,
      expectedKey:
        '{integracore-cache}:engine:workspace:flatObjectMetadataMaps:123:hash',
    },
    {
      keyPrefix: '{integracore[prod]*?\\}',
      isTestEnvironment: false,
      expectedKey:
        '{integracore[prod]*?\\}:engine:workspace:flatObjectMetadataMaps:123:hash',
    },
    {
      keyPrefix: '',
      isTestEnvironment: true,
      expectedKey:
        'integration-tests:engine:workspace:flatObjectMetadataMaps:123:hash',
    },
    {
      keyPrefix: '{integracore-cache}',
      isTestEnvironment: true,
      expectedKey:
        'integration-tests:{integracore-cache}:engine:workspace:flatObjectMetadataMaps:123:hash',
    },
  ])('builds $expectedKey', ({ keyPrefix, isTestEnvironment, expectedKey }) => {
    expect(
      getCacheStorageKey({
        key: 'flatObjectMetadataMaps:123:hash',
        namespace: CacheStorageNamespace.EngineWorkspace,
        keyPrefix,
        isTestEnvironment,
      }),
    ).toBe(expectedKey);
  });

  it('keeps the configured prefix before other hash tags in the key', () => {
    expect(
      getCacheStorageKey({
        key: 'user:{123}:data',
        namespace: CacheStorageNamespace.EngineCoreEntity,
        keyPrefix: '{integracore-cache}',
      }),
    ).toBe('{integracore-cache}:engine:core-entity:user:{123}:data');
  });
});

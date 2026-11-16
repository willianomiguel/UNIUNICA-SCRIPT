import { type SdkClientUrls } from '@/types/SdkClientUrls';
import { FRONT_COMPONENT_SHARED_DEPENDENCIES_IMPORT_SPECIFIER } from 'integracore-shared/application';
import { isDefined } from 'integracore-shared/utils';

export const buildBlobUrlBySpecifier = ({
  sdkModuleBlobUrls,
  sharedDependenciesModuleBlobUrl,
}: {
  sdkModuleBlobUrls: SdkClientUrls | null;
  sharedDependenciesModuleBlobUrl: string | null;
}): Record<string, string> => ({
  ...(isDefined(sdkModuleBlobUrls)
    ? {
        'integracore-client-sdk/core': sdkModuleBlobUrls.core,
        'integracore-client-sdk/metadata': sdkModuleBlobUrls.metadata,
      }
    : {}),
  ...(isDefined(sharedDependenciesModuleBlobUrl)
    ? {
        [FRONT_COMPONENT_SHARED_DEPENDENCIES_IMPORT_SPECIFIER]:
          sharedDependenciesModuleBlobUrl,
      }
    : {}),
});

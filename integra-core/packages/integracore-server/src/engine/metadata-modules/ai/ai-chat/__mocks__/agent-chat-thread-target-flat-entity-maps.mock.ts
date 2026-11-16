import { isDefined } from 'integracore-shared/utils';

import { type AllFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/all-flat-entity-maps.type';
import { computeIntegraCoreStandardApplicationAllFlatEntityMaps } from 'src/engine/workspace-manager/integracore-standard-application/utils/integracore-standard-application-all-flat-entity-maps.constant';

const {
  allFlatEntityMaps: { flatObjectMetadataMaps, flatFieldMetadataMaps },
} = computeIntegraCoreStandardApplicationAllFlatEntityMaps({
  now: '2026-09-24T00:00:00.000Z',
  workspaceId: '20202020-1111-4111-8111-111111111111',
  integracoreStandardApplicationId: '20202020-2222-4222-8222-222222222222',
});

const fieldIdsByObjectMetadataId = new Map<string, string[]>();

for (const flatFieldMetadata of Object.values(
  flatFieldMetadataMaps.byUniversalIdentifier,
).filter(isDefined)) {
  fieldIdsByObjectMetadataId.set(flatFieldMetadata.objectMetadataId, [
    ...(fieldIdsByObjectMetadataId.get(flatFieldMetadata.objectMetadataId) ??
      []),
    flatFieldMetadata.id,
  ]);
}

// standard objects come with empty fieldIds that the workspace cache fills in
export const AGENT_CHAT_THREAD_TARGET_FLAT_ENTITY_MAPS_MOCK: Pick<
  AllFlatEntityMaps,
  'flatObjectMetadataMaps' | 'flatFieldMetadataMaps'
> = {
  flatObjectMetadataMaps: {
    ...flatObjectMetadataMaps,
    byUniversalIdentifier: Object.fromEntries(
      Object.values(flatObjectMetadataMaps.byUniversalIdentifier)
        .filter(isDefined)
        .map((flatObjectMetadata) => [
          flatObjectMetadata.universalIdentifier,
          {
            ...flatObjectMetadata,
            fieldIds:
              fieldIdsByObjectMetadataId.get(flatObjectMetadata.id) ?? [],
          },
        ]),
    ),
  },
  flatFieldMetadataMaps,
};

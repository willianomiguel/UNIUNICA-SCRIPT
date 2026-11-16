import { type ViewSortManifest } from 'integracore-shared/application';
import { isDefined } from 'integracore-shared/utils';

import { type UniversalFlatViewSort } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/universal-flat-view-sort.type';

export const fromFlatViewSortToViewSortManifest = ({
  flatViewSort,
}: {
  flatViewSort: UniversalFlatViewSort;
}): ViewSortManifest => ({
  universalIdentifier: flatViewSort.universalIdentifier,
  fieldMetadataUniversalIdentifier:
    flatViewSort.fieldMetadataUniversalIdentifier,
  direction: flatViewSort.direction,
  ...(isDefined(flatViewSort.subFieldName)
    ? { subFieldName: flatViewSort.subFieldName }
    : {}),
});

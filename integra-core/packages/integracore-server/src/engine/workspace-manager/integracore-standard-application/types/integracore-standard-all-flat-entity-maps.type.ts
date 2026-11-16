import { type AllFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/all-flat-entity-maps.type';
import { type MetadataToFlatEntityMapsKey } from 'src/engine/metadata-modules/flat-entity/types/metadata-to-flat-entity-maps-key.type';
import { type INTEGRA_STANDARD_ALL_METADATA_NAME } from 'src/engine/workspace-manager/integracore-standard-application/constants/integracore-standard-all-metadata-name.constant';

export type IntegraCoreStandardAllFlatEntityMaps = Pick<
  AllFlatEntityMaps,
  MetadataToFlatEntityMapsKey<
    (typeof INTEGRA_STANDARD_ALL_METADATA_NAME)[number]
  >
>;

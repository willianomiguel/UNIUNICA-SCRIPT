import { type FieldMetadataType, type RelationType } from 'integracore-shared/types';

import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';

export type DatabaseEventTriggerManifestField = {
  universalIdentifier: string;
  name: string;
  type: FieldMetadataType;
  objectUniversalIdentifier: string;
  universalSettings: FlatFieldMetadata['universalSettings'];
  relationType?: RelationType;
};

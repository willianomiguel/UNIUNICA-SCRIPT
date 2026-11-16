import { type AllMetadataName } from 'integracore-shared/metadata';

export const SCHEMA_AFFECTING_WORKSPACE_MIGRATION_METADATA_NAMES = [
  'objectMetadata',
  'fieldMetadata',
  'index',
] as const satisfies readonly AllMetadataName[];

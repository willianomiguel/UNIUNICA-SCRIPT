import { STANDARD_OBJECTS } from 'integracore-shared/metadata';

// These objects store the permissions themselves, so record permissions never apply to their records
export const PERMISSION_STORAGE_OBJECT_UNIVERSAL_IDENTIFIERS: string[] = [
  STANDARD_OBJECTS.accessGroup.universalIdentifier,
  STANDARD_OBJECTS.recordShare.universalIdentifier,
];

import { EntityMetadataNotFoundError } from 'typeorm/error/EntityMetadataNotFoundError';

import {
  IntegraCoreOrmException,
  IntegraCoreOrmExceptionCode,
} from 'src/engine/integracore-orm/exceptions/integracore-orm.exception';

// A workspace object can be absent when upgrading from a version that predates it.
// The v1 GlobalWorkspaceDataSource throws EntityMetadataNotFoundError, while the v2
// datasource throws IntegraCoreOrmException(UNKNOWN_OBJECT). Backfill commands must treat
// both as "object not provisioned yet" and skip rather than fail the upgrade.
export const isWorkspaceObjectNotFoundError = (error: unknown): boolean =>
  error instanceof EntityMetadataNotFoundError ||
  (error instanceof IntegraCoreOrmException &&
    error.code === IntegraCoreOrmExceptionCode.UNKNOWN_OBJECT);

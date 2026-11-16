import {
  IntegraCoreOrmException,
  IntegraCoreOrmExceptionCode,
} from 'src/engine/integracore-orm/exceptions/integracore-orm.exception';

export const isDuplicateEntryError = (error: unknown): boolean =>
  error instanceof IntegraCoreOrmException &&
  error.code === IntegraCoreOrmExceptionCode.DUPLICATE_ENTRY_DETECTED;

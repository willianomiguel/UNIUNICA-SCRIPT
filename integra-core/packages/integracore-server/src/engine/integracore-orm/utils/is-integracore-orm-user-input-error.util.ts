import {
  type IntegraCoreOrmException,
  IntegraCoreOrmExceptionCode,
} from 'src/engine/integracore-orm/exceptions/integracore-orm.exception';

// Codes that describe a problem with the caller's input rather than a server
// fault; the API layers surface them as user input errors (400) instead of 500
export const isIntegraCoreOrmUserInputError = (
  error: IntegraCoreOrmException,
): boolean => {
  switch (error.code) {
    case IntegraCoreOrmExceptionCode.INVALID_INPUT:
    case IntegraCoreOrmExceptionCode.INVALID_PARAMETER:
    case IntegraCoreOrmExceptionCode.UNKNOWN_OBJECT:
    case IntegraCoreOrmExceptionCode.UNKNOWN_COLUMN:
    case IntegraCoreOrmExceptionCode.UNKNOWN_RELATION:
    case IntegraCoreOrmExceptionCode.UNSUPPORTED_OPERATION:
    case IntegraCoreOrmExceptionCode.TOO_MANY_RECORDS_TO_UPDATE:
    case IntegraCoreOrmExceptionCode.ENTITY_NOT_FOUND:
    case IntegraCoreOrmExceptionCode.DUPLICATE_ENTRY_DETECTED:
    case IntegraCoreOrmExceptionCode.CONNECT_RECORD_NOT_FOUND:
    case IntegraCoreOrmExceptionCode.CONNECT_NOT_ALLOWED:
    case IntegraCoreOrmExceptionCode.CONNECT_UNIQUE_CONSTRAINT_ERROR:
      return true;
    default:
      return false;
  }
};

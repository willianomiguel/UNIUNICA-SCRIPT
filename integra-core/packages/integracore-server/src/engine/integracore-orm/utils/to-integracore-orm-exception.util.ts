import {
  IntegraCoreOrmException,
  IntegraCoreOrmExceptionCode,
} from 'src/engine/integracore-orm/exceptions/integracore-orm.exception';
import {
  WorkspaceQueryExecutorException,
  WorkspaceQueryExecutorExceptionCode,
} from 'src/engine/workspace-query-executor/exceptions/workspace-query-executor.exception';

const INTEGRA_ORM_CODE_BY_EXECUTOR_CODE: Record<
  WorkspaceQueryExecutorExceptionCode,
  IntegraCoreOrmExceptionCode
> = {
  [WorkspaceQueryExecutorExceptionCode.QUERY_READ_TIMEOUT]:
    IntegraCoreOrmExceptionCode.QUERY_READ_TIMEOUT,
  [WorkspaceQueryExecutorExceptionCode.TRANSIENT_DATABASE_ERROR]:
    IntegraCoreOrmExceptionCode.TRANSIENT_DATABASE_ERROR,
  [WorkspaceQueryExecutorExceptionCode.DUPLICATE_ENTRY_DETECTED]:
    IntegraCoreOrmExceptionCode.DUPLICATE_ENTRY_DETECTED,
  [WorkspaceQueryExecutorExceptionCode.INVALID_INPUT]:
    IntegraCoreOrmExceptionCode.INVALID_INPUT,
  [WorkspaceQueryExecutorExceptionCode.MISSING_PARAMETER]:
    IntegraCoreOrmExceptionCode.MISSING_PARAMETER,
  [WorkspaceQueryExecutorExceptionCode.INVALID_PARAMETER]:
    IntegraCoreOrmExceptionCode.INVALID_PARAMETER,
  [WorkspaceQueryExecutorExceptionCode.MALFORMED_SQL]:
    IntegraCoreOrmExceptionCode.MALFORMED_SQL,
  [WorkspaceQueryExecutorExceptionCode.UNSUPPORTED_OPERATION]:
    IntegraCoreOrmExceptionCode.UNSUPPORTED_OPERATION,
};

export const toIntegraCoreOrmException = (error: unknown): unknown => {
  if (!(error instanceof WorkspaceQueryExecutorException)) {
    return error;
  }

  const integracoreOrmException = new IntegraCoreOrmException(
    error.message,
    INTEGRA_ORM_CODE_BY_EXECUTOR_CODE[error.code],
    { userFriendlyMessage: error.userFriendlyMessage },
  );

  return 'cause' in error
    ? Object.assign(integracoreOrmException, { cause: error.cause })
    : integracoreOrmException;
};

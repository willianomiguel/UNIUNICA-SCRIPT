import {
  IntegraCoreOrmException,
  IntegraCoreOrmExceptionCode,
} from 'src/engine/integracore-orm/exceptions/integracore-orm.exception';
import { toIntegraCoreOrmException } from 'src/engine/integracore-orm/utils/to-integracore-orm-exception.util';
import {
  WorkspaceQueryExecutorException,
  WorkspaceQueryExecutorExceptionCode,
} from 'src/engine/workspace-query-executor/exceptions/workspace-query-executor.exception';

describe('toIntegraCoreOrmException', () => {
  it.each(Object.values(WorkspaceQueryExecutorExceptionCode))(
    'keeps the code, message and user friendly message of %s',
    (code) => {
      const error = new WorkspaceQueryExecutorException({
        message: 'message',
        code,
      });

      const result = toIntegraCoreOrmException(error);

      expect(result).toBeInstanceOf(IntegraCoreOrmException);
      expect(result).toMatchObject({
        code: IntegraCoreOrmExceptionCode[code],
        message: 'message',
        userFriendlyMessage: error.userFriendlyMessage,
      });
    },
  );

  it('keeps the cause', () => {
    const cause = new Error('pg error');
    const error = Object.assign(
      new WorkspaceQueryExecutorException({
        message: 'message',
        code: WorkspaceQueryExecutorExceptionCode.INVALID_INPUT,
      }),
      { cause },
    );

    expect(toIntegraCoreOrmException(error)).toHaveProperty('cause', cause);
  });

  it('returns any other error unchanged', () => {
    const error = new Error('other');

    expect(toIntegraCoreOrmException(error)).toBe(error);
  });
});

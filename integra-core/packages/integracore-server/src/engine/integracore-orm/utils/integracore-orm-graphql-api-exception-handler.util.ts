import { UserInputError } from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import { type IntegraCoreOrmException } from 'src/engine/integracore-orm/exceptions/integracore-orm.exception';
import { isIntegraCoreOrmUserInputError } from 'src/engine/integracore-orm/utils/is-integracore-orm-user-input-error.util';

export const integracoreOrmGraphqlApiExceptionHandler = (
  error: IntegraCoreOrmException,
) => {
  if (isIntegraCoreOrmUserInputError(error)) {
    throw new UserInputError(error.message, {
      userFriendlyMessage: error.userFriendlyMessage,
    });
  }

  throw error;
};

import { toIntegraCoreOrmException } from 'src/engine/integracore-orm/utils/to-integracore-orm-exception.util';
import {
  type CompiledStatement,
  type NamedParameters,
  compileNamedParameters,
} from 'src/engine/workspace-query-executor/utils/compile-named-parameters.util';

export const compileIntegraCoreOrmStatement = ({
  sql,
  parameters,
}: {
  sql: string;
  parameters: NamedParameters;
}): CompiledStatement => {
  try {
    return compileNamedParameters(sql, parameters);
  } catch (error) {
    throw toIntegraCoreOrmException(error);
  }
};

import { matchPath, parsePath } from 'react-router-dom';
import { AppPath } from 'integracore-shared/types';
import { isDefined } from 'integracore-shared/utils';

export const getRecordShowParamsFromPath = (path: string) => {
  const match = matchPath(
    AppPath.RecordShowPage,
    parsePath(path).pathname ?? '',
  );

  const objectNameSingular = match?.params.objectNameSingular;
  const objectRecordId = match?.params.objectRecordId;

  if (!isDefined(objectNameSingular) || !isDefined(objectRecordId)) {
    return null;
  }

  return { objectNameSingular, objectRecordId };
};

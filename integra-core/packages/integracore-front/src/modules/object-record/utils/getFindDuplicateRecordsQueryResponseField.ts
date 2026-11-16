import { doNotTranslate } from 'integracore-shared/i18n';

export const getFindDuplicateRecordsQueryResponseField = (
  objectNameSingular: string,
) => doNotTranslate(`${objectNameSingular}Duplicates`);

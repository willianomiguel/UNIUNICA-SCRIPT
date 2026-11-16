import { doNotTranslate } from 'integracore-shared/i18n';

export const getForeignKeyNameFromRelationFieldName = (nameSingular: string) =>
  doNotTranslate(`${nameSingular}Id`);

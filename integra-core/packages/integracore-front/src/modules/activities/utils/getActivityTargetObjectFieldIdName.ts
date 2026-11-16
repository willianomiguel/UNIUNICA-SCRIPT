import { capitalize } from 'integracore-shared/utils';

export const getActivityTargetObjectFieldIdName = ({
  nameSingular,
}: {
  nameSingular: string;
}) => {
  return `target${capitalize(nameSingular)}Id`;
};

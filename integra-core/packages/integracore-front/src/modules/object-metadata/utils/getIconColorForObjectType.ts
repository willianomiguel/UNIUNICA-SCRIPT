import { themeCssVariables } from 'integracore-ui/theme';

export const getIconColorForObjectType = (objectType: string): string => {
  switch (objectType) {
    case 'note':
      return themeCssVariables.color.yellow;
    case 'task':
      return themeCssVariables.color.blue;
    default:
      return 'currentColor';
  }
};

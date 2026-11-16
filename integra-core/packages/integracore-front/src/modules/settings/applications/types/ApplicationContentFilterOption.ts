import { type ThemeColor } from 'integracore-ui/theme';

export type ApplicationContentFilterOption = {
  universalIdentifier: string;
  label: string;
  icon?: string | null;
  color?: ThemeColor;
};

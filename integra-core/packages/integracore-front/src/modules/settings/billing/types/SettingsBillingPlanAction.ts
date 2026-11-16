import { type IconComponent } from 'integracore-ui/icon';
import {
  type ButtonColor,
  type ButtonVariant,
} from 'integracore-ui/primitives/input';

export type SettingsBillingPlanAction = {
  color?: ButtonColor;
  disabled?: boolean;
  Icon?: IconComponent;
  isLoading?: boolean;
  onClick?: () => void;
  title: string;
  variant: ButtonVariant;
};

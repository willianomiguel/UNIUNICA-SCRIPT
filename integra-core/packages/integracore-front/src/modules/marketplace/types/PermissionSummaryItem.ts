import { type IconComponent } from 'integracore-ui/icon';

export type PermissionSummaryItem = {
  Icon: IconComponent;
  label: string;
  details?: {
    title: string;
    items: string[];
  };
};

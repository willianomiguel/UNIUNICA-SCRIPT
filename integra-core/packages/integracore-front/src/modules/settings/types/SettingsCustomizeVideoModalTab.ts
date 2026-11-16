import { type IconComponent } from 'integracore-ui/icon';

export type SettingsCustomizeVideoModalTab = {
  id: string;
  title: string;
  Icon: IconComponent;
  vimeoId: string;
  hasSound?: boolean;
};

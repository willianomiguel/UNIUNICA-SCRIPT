import { type AvatarShape } from 'integracore-ui/primitives/data-display';
import { type IconComponent } from 'integracore-ui/icon';

export type SelectableItem<T = object> = T & {
  id: string;
  name: string;
  avatarUrl?: string;
  avatarShape?: AvatarShape;
  AvatarIcon?: IconComponent;
  isSelected: boolean;
  isIconInverted?: boolean;
};

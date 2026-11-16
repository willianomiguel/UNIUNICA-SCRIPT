import { type IconComponent } from 'integracore-ui/icon';
import {
  type AvatarProps,
  type AvatarShape,
} from 'integracore-ui/primitives/data-display';
import { type Nullable } from 'integracore-shared/types';

export type AvatarOrIconProps = Pick<
  AvatarProps,
  'src' | 'name' | 'colorSeed'
> & {
  shape?: Nullable<AvatarShape>;
  Icon?: IconComponent;
  IconColor?: string;
  IconBackgroundColor?: string;
  isIconInverted?: boolean;
  onClick?: () => void;
};

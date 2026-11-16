import { type IconComponent } from 'integracore-ui/icon';
import { Tag } from 'integracore-ui/primitives/data-display';
import { type ThemeColor } from 'integracore-ui/theme';
import { isDefined } from 'integracore-shared/utils';

type SelectDisplayProps = {
  color: ThemeColor | 'transparent';
  label: string;
  Icon?: IconComponent;
};

export const SelectDisplay = ({ color, label, Icon }: SelectDisplayProps) => (
  <Tag
    truncate={false}
    color={color}
    startIcon={isDefined(Icon) ? <Icon /> : undefined}
  >
    {label}
  </Tag>
);

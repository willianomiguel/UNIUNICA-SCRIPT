import { IconChevronRight } from 'integracore-ui/icon';
import { useTheme } from 'integracore-ui/theme';

export const SettingsApplicationTableRowChevronIcon = () => {
  const theme = useTheme();

  return (
    <IconChevronRight
      size={theme.icon.size.md}
      stroke={theme.icon.stroke.sm}
      color={theme.font.color.light}
    />
  );
};

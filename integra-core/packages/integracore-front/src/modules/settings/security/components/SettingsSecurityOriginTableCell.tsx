import { IconWorld } from 'integracore-ui/icon';
import { Avatar } from 'integracore-ui/primitives/data-display';
import { OverflowingTextWithTooltip } from 'integracore-ui/primitives/typography';
import { themeCssVariables, useTheme } from 'integracore-ui/theme';

import { allowRequestsToIntegraCoreIconsState } from '@/client-config/states/allowRequestsToIntegraCoreIcons';
import { getOriginFaviconUrl } from '@/settings/security/utils/getOriginFaviconUrl';
import { TableCell } from '@/ui/layout/table/components/TableCell';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

type SettingsSecurityOriginTableCellProps = {
  origin: string;
};

export const SettingsSecurityOriginTableCell = ({
  origin,
}: SettingsSecurityOriginTableCellProps) => {
  const theme = useTheme();
  const allowRequestsToIntegraCoreIcons = useAtomStateValue(
    allowRequestsToIntegraCoreIconsState,
  );

  const faviconUrl = getOriginFaviconUrl({
    origin,
    allowRequestsToIntegraCoreIcons,
  });

  return (
    <TableCell
      color={themeCssVariables.font.color.primary}
      gap={themeCssVariables.spacing[2]}
      minWidth="0"
      overflow="hidden"
    >
      <Avatar.Root
        size="md"
        shape="square"
        backgroundColor="transparent"
        aria-hidden
      >
        <Avatar.Image src={faviconUrl} alt="" />
        <Avatar.Fallback render={<IconWorld size={theme.icon.size.md} />} />
      </Avatar.Root>
      <OverflowingTextWithTooltip text={origin} />
    </TableCell>
  );
};

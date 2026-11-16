import { type WidgetCommandMenuItem } from '@/command-menu-item/types/WidgetCommandMenuItem';
import { isDefined } from 'integracore-shared/utils';
import { Button } from 'integracore-ui/primitives/input';

type WidgetCommandMenuItemButtonsProps = {
  commandMenuItems: WidgetCommandMenuItem[];
};

export const WidgetCommandMenuItemButtons = ({
  commandMenuItems,
}: WidgetCommandMenuItemButtonsProps) => (
  <>
    {commandMenuItems
      .filter((commandMenuItem) => commandMenuItem.isPinned !== false)
      .map((commandMenuItem) => (
        <Button
          key={commandMenuItem.id}
          size="sm"
          startIcon={
            isDefined(commandMenuItem.Icon) ? (
              <commandMenuItem.Icon />
            ) : undefined
          }
          shortcut={commandMenuItem.shortcut}
          onClick={commandMenuItem.onClick}
          disabled={commandMenuItem.disabled}
          variant={commandMenuItem.isPrimaryCTA ? 'solid' : 'outline'}
          color={commandMenuItem.isPrimaryCTA ? 'accent' : 'neutral'}
        >
          {commandMenuItem.label}
        </Button>
      ))}
  </>
);

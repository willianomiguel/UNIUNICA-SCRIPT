import { useLingui } from '@lingui/react/macro';
import { IconButton } from 'integracore-ui/components/input';
import { Dropdown } from 'integracore-ui/components/navigation';
import { IconFilter } from 'integracore-ui/icon';

type SettingsSearchFilterTriggerProps = {
  ariaLabel?: string;
};

export const SettingsSearchFilterTrigger = ({
  ariaLabel,
}: SettingsSearchFilterTriggerProps) => {
  const { t } = useLingui();

  return (
    <Dropdown.Trigger
      render={
        <IconButton aria-label={ariaLabel ?? t`Filter`}>
          <IconFilter />
        </IconButton>
      }
    />
  );
};

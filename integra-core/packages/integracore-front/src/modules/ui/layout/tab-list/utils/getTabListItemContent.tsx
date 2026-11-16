import { isNonEmptyString, isString } from '@sniptt/guards';
import { isDefined } from 'integracore-shared/utils';
import { Avatar, Badge } from 'integracore-ui/primitives/data-display';

import { type SingleTabProps } from '@/ui/layout/tab-list/types/SingleTabProps';

export const getTabListItemContent = ({
  Icon,
  logo,
  title,
  colorSeed,
  pill,
}: SingleTabProps) => ({
  startIcon:
    isDefined(Icon) || isNonEmptyString(logo) ? (
      <>
        {isDefined(Icon) && <Icon />}
        {isNonEmptyString(logo) && (
          <Avatar
            src={logo}
            size="md"
            name={title}
            colorSeed={colorSeed}
            aria-hidden
          />
        )}
      </>
    ) : undefined,
  badge: isString(pill) ? <Badge>{pill}</Badge> : pill,
});

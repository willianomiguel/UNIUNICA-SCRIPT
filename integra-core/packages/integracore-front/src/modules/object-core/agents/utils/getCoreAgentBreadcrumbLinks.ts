import { t } from '@lingui/core/macro';
import { AppPath } from 'integracore-shared/types';
import { getAppPath } from 'integracore-shared/utils';

import { type BreadcrumbProps } from '@/ui/navigation/bread-crumb/types/BreadcrumbProps';

export const getCoreAgentBreadcrumbLinks = (
  links: BreadcrumbProps['links'] = [],
): BreadcrumbProps['links'] => [
  {
    children: t`Agents`,
    href: getAppPath(AppPath.AgentIndexPage),
  },
  ...links,
];

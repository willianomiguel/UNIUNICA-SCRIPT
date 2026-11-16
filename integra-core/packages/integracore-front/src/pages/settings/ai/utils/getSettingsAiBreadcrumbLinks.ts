import { t } from '@lingui/core/macro';
import { SettingsPath } from 'integracore-shared/types';
import { getSettingsPath } from 'integracore-shared/utils';

export const getSettingsAiBreadcrumbLinks = (currentPageLabel: string) => [
  {
    children: t`Workspace`,
    href: getSettingsPath(SettingsPath.General),
  },
  { children: t`AI`, href: getSettingsPath(SettingsPath.AI) },
  { children: currentPageLabel },
];

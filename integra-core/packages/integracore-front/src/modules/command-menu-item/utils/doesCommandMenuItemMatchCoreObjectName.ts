import { type CommandMenuCoreObjectName } from 'integracore-shared/types';
import { isDefined } from 'integracore-shared/utils';
import { type CommandMenuItemFieldsFragment } from '~/generated-metadata/graphql';

export const doesCommandMenuItemMatchCoreObjectName =
  (coreObjectName: CommandMenuCoreObjectName | null) =>
  (item: Pick<CommandMenuItemFieldsFragment, 'availabilityCoreObjectName'>) =>
    !isDefined(item.availabilityCoreObjectName) ||
    item.availabilityCoreObjectName === coreObjectName;

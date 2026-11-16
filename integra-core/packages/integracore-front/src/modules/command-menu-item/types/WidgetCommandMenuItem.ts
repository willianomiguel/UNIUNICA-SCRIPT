import { type ShortcutDefinition } from 'integracore-ui/primitives/typography';
import { type IconComponent } from 'integracore-ui/icon';
import { type EngineComponentKey } from '~/generated-metadata/graphql';

export type WidgetCommandMenuItem = {
  id: string;
  label: string;
  Icon?: IconComponent;
  isPrimaryCTA?: boolean;
  isPinned?: boolean;
  onClick: () => void;
  disabled?: boolean;
  shortcut?: ShortcutDefinition;
  replacedEngineComponentKey?: EngineComponentKey;
};

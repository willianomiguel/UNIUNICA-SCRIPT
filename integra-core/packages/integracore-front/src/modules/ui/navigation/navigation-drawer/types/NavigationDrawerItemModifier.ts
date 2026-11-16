import { type ShortcutDefinition } from 'integracore-ui/primitives/typography';

export type NavigationDrawerItemModifier =
  | 'soon'
  | 'new'
  | { keyboard: ShortcutDefinition };

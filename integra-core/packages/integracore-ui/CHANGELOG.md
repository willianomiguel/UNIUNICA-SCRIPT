# Changelog

## Unreleased

### Breaking changes

`IconsProvider`, `useIcons`, `Icon` (the by-name icon) and `IconProps` moved from `integracore-ui/icon` (and the root `integracore-ui` entry) to `integracore-ui/icon/provider`. The provider loads the full Tabler catalog, so `integracore-ui/icon` now ships only the named icons and icon types. Change `import { IconsProvider, useIcons } from 'integracore-ui/icon'` to `import { IconsProvider, useIcons } from 'integracore-ui/icon/provider'`.

`Text` and `OverflowingTextWithTooltip` now offer optional theme `size`, `weight` and `color` props. Omitted props preserve inherited typography. Native `color` strings must move to `style={{ color: customColor }}`; `color` accepts `primary`, `secondary`, `tertiary` and `light`.

`OverflowingTextWithTooltip.size` now means font size (`xxs` through `xxl`). The previously removed `small`/`large` height options are not aliases; replace the old `large` 16px height with a native style when needed.


Removed `MenuItem`, `MenuItemAvatar`, `MenuItemDraggable`, `MenuItemSuggestion` and `MenuPicker` from `integracore-ui/components/navigation` and the aggregate exports. Their props types and `MenuItemDraggableGripMode` are also removed. Applications must migrate these imports before upgrading.

| Removed API                                        | Replacement                                                                                                                                                                                                                                |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `MenuItem` and `MenuItemProps`                     | Use `Dropdown.ActionItem` for menu commands, `Dropdown.OptionItem` for menu choices, `ListItemButton` for standalone actions, or `ListItem` for passive content.                                                                           |
| `MenuItemAvatar` and `MenuItemAvatarProps`         | Compose `Avatar` inside the appropriate canonical row.                                                                                                                                                                                     |
| `MenuItemDraggable` and `MenuItemDraggableProps`   | Compose `ListItem` from `integracore-ui/primitives/navigation` inside the application's drag host. The host owns drag handles and reordering. Keep independent action buttons in `ListItem.actions`.                                            |
| `MenuItemSuggestion` and `MenuItemSuggestionProps` | Use `Dropdown.ActionItem` or `Dropdown.OptionItem` in a Dropdown page. For editor suggestions, compose `ListItem` or `ListItemButton` with the editor's option IDs and active-descendant state, keeping keyboard navigation in the editor. |
| `MenuPicker` and `MenuPickerProps`                 | Use `Button` from `integracore-ui/primitives/input` for standalone actions or pressed toggles. Use a selection owner such as `Dropdown.SelectionGroup` or `RadioGroup` when the workflow requires grouped choice navigation.                    |
| `MenuItemDraggableGripMode`                        | Choose grip presentation in the application's drag host.                                                                                                                                                                                   |

The package remains in alpha and follows the IntegraCore SDK release version.

## Base documentation

O guia do motor para apps (com exemplos de objetos, campos, relações, funções, telas, permissões e
testes) está em `integra-core/packages/integracore-agent-skills/skills/develop-app/SKILL.md`, com as
referências em `integra-core/packages/integracore-agent-skills/references/`. Um app completo de
exemplo fica em `integra-core/packages/integracore-apps/examples/postcard`.

## Front components

Apply estes essenciais em qualquer front component:

- For every visible front component, use `integra-ui` components by default. Reuse an equivalent IntegraCore UI control before writing a custom control or adding another UI library. Plain HTML is appropriate for layout containers and content without a IntegraCore UI equivalent.
- Import from public family subpaths: `integra-ui/components/input` for `MainButton` and `LightButton`, `integra-ui/primitives/input` for foundational controls, `integra-ui/primitives/typography` for text, and the matching family for other components. Import individual icons from `integra-ui/icon`, never from `integra-ui/icon/provider`. Keep `integra-ui`, `integra-sdk` and `integra-client-sdk` pinned to the same version in `devDependencies`.
- The renderer supplies styles and the workspace theme. Use `useTheme()` from `integra-ui/theme` inside the component for spacing, colors, typography and radii. Do not add a root `ThemeProvider`, force a color scheme, or copy standalone stylesheet setup into a front component. Never dereference theme tokens at module top level, since entity files also run during manifest extraction.
- Use component props before custom styles. Keep layouts compact and responsive to widget width, give inputs visible labels and icon-only actions accessible names, and handle loading, empty, error, disabled and saving states. Verify light and dark themes, narrow widths and long values.
- Use `openCommandConfirmationModal` or `CommandModal` from `integra-sdk/front-component` for confirmation dialogs and `enqueueSnackbar` for notifications. Do not render `Dialog`, `AlertDialog`, native `dialog` elements or native browser popovers directly. Use IntegraCore UI `Dropdown` for menus and pickers.
- Components run in a Web Worker with a sandboxed, partial `window` and `document`. Prefer CSS for layout and width-based queries. `canvas` and `scrollIntoView` are unsupported; consult the current runtime limitations before using other browser APIs.
- Keep the `.tsx` entity's direct `export default defineFrontComponent({ ... })` call. The SDK mounts the component, so do not call `react-dom/client` or use browser globals at module top level.
- Read workspace data with `CoreApiClient` from `integra-client-sdk/core` and selection with `useSelectedRecordIds()` from `integra-sdk/front-component`. Call third-party APIs from logic functions; secret application variables never reach a front component.

Leia `integra-core/packages/integracore-agent-skills/references/front-component-ui.md` antes de implementar,
para o setup do renderer e as limitações de runtime. As páginas de componentes, primitivas e tema ficam
em `integra-core/packages/integracore-ui/src/`; confira props e composição atuais no código antes de usar.

## UUID requirement

- All generated UUIDs must be valid UUID v4.

## Common Pitfalls

- Creating a view without a navigationMenuItem associated. This will make the view available on the left sidebar.
- Creating a front component that overflows its widget. Fit the available width and let content determine height, unless the component is the tab's single `heightBehavior: 'TAB_VIEWPORT'` widget and owns internal scrolling.

## Best practice

It's highly recommended to create new app entities using `yarn integra app add`. These are the options:

| Entity type     | Command                          | Generated file                    |
| --------------- | -------------------------------- | --------------------------------- |
| Object          | `yarn integra app add object`          | `src/objects/<name>.ts`           |
| Field           | `yarn integra app add field`           | `src/fields/<name>.ts`            |
| Logic function  | `yarn integra app add logic-function`  | `src/logic-functions/<name>.ts`   |
| Front component | `yarn integra app add front-component` | `src/front-components/<name>.tsx` |

These generators create the required UUID v4 identifiers. For roles, skills, agents, views, navigation items, layouts, commands, and connection providers, use the corresponding `integra-sdk/define` export and generate UUID v4 identifiers.

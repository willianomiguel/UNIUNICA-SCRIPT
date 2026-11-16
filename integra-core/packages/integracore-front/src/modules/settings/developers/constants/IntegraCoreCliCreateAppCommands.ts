import { doNotTranslate } from 'integracore-shared/i18n';

// A bare `npx integracore` would run the deprecated binary from the app's integracore-sdk
export const INTEGRA_CLI_CREATE_APP_COMMANDS = doNotTranslate([
  'npx integracore@latest app init my-app',
  'cd my-app',
  'yarn install',
  'npx integracore@latest app apply --create',
  'npx integracore@latest app dev',
]);

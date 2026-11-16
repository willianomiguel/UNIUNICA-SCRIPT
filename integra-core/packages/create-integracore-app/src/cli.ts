#!/usr/bin/env node

console.error(`create-integracore-app has been retired. Use the standalone IntegraCore CLI:

  npm install -g integracore
  integracore app init my-app
  cd my-app
  yarn install
  integracore auth login --url https://your-workspace.integracore.com
  integracore app apply --create

For an existing app, run integracore app dev from its directory.
Keep integracore-sdk installed for application definitions and runtime helpers.`);
process.exitCode = 1;

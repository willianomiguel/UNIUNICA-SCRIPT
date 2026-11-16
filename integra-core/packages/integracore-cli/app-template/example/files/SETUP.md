# Setup

Use Node.js from `.nvmrc` and Yarn 4. Install the standalone CLI globally:

```bash
npm install -g integracore
yarn install
```

Connect to your existing IntegraCore workspace, or start a server using the [local-server guide](https://docs.integracore.com/developers/extend/apps/getting-started/local-server):

```bash
integracore auth login --url https://your-workspace.integracore.com --name dev
integracore app apply --create
integracore app dev
```

The first apply registers and installs your app. Dev watches and syncs later source changes. `integracore app init` does not authenticate, start containers, or install the app.

## Validation

- `yarn lint`, lint the project.
- `yarn typecheck`, check source and test types.
- `yarn test:unit`, run unit tests.
- `yarn test`, run integration tests against a disposable workspace configured with `INTEGRA_API_URL` and `INTEGRA_API_KEY`.

Integration tests install and uninstall the app. Install the CLI globally or set `INTEGRA_CLI` to a local executable path.

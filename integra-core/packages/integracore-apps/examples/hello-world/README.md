This is a [IntegraCore](https://integracore.com) application project developed with the [IntegraCore CLI](https://www.npmjs.com/package/integracore).

## Getting Started

First, authenticate to your workspace:

```bash
integracore auth login --url http://localhost:2020 --name local
```

Then, start development mode to sync your app and watch for changes:

```bash
integracore app dev
```

Open your IntegraCore instance and go to `/settings/applications` section to see the result.

## Available Commands

Run `integracore --help` to list all available commands. Common commands:

```bash
# Remotes & Authentication
integracore auth login --url http://localhost:2020 --name local     # Authenticate with IntegraCore
integracore auth status         # Check auth status
integracore remote use            # Set default remote
integracore remote list           # List all configured remotes
integracore remote remove <name>  # Remove a remote

# Application
integracore app dev            # Start dev mode (watch, build, sync, and auto-generate typed client)
integracore app add        # Scaffold a new entity (object, field, function, front-component, role, view, navigation-menu-item)
integracore app logs    # Stream function logs
integracore app exec    # Execute a function with JSON payload
integracore app uninstall  # Uninstall app from workspace
```

## Integration Tests

If your project includes the example integration test (`src/__tests__/app-install.integration-test.ts`), you can run it with:

```bash
# Make sure a IntegraCore server is running at http://localhost:3000
yarn test
```

The test builds and installs the app, then verifies it appears in the applications list. Test configuration (API URL and API key) is defined in `vitest.config.ts`.

## LLMs instructions

Main docs and pitfalls are available in LLMS.md file.

## Learn More

To learn more about IntegraCore applications, take a look at the following resources:

- [integracore-sdk](https://www.npmjs.com/package/integracore-sdk) - learn about `integracore-sdk` tool.
- [IntegraCore doc](https://docs.integracore.com/) - IntegraCore's documentation.
- Join our [Discord](https://discord.gg/cx5n4Jzs57)

You can check out [the IntegraCore GitHub repository](https://github.com/integracorehq/integracore) - your feedback and contributions are welcome!

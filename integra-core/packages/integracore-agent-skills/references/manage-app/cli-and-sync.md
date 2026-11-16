# CLI And Sync

Use this reference for IntegraCore app CLI command behavior, remotes, authentication, sync, validation commands, build, deploy, logs, function execution, and CI/CD troubleshooting.

Use `../develop-app/app-structure.md` only for app file layout and post-entity-edit validation checklists.

## App Checks

Before running operational commands, confirm the current directory is a IntegraCore app and inspect the active scripts and remotes:

```bash
test -f package.json
test -f src/application-config.ts
sed -n '1,220p' package.json
integracore remote list
```

Treat deploys, uninstalls, production remote changes, and production syncs as externally visible actions. Ask for explicit confirmation before running them when the target is production or user data could be affected.

## Validation Commands

Use these commands to validate an app after changes:

```bash
integracore app typecheck
yarn lint
```

If the app is already installed on the active remote, preview and then apply
the metadata changes:

```bash
integracore app plan
integracore app apply
```

`integracore app typecheck` checks generated app types and TypeScript compatibility. `yarn lint` checks local lint rules. `integracore app plan` previews metadata changes, and `integracore app apply` performs a bounded build/sync against the active remote.

`integracore app plan` is read-only and requires the app to already be installed
on the active remote. For a first sync, run `integracore app apply --create`; it registers
and installs the app. `integracore app init` only writes the source files, so
installation and authentication are explicit steps.

If a validation command fails because of entity definitions, switch to `develop-app` for the fix. If it fails because of remotes, authentication, build tooling, sync, logs, deploys, or CI/CD, stay in `manage-app`.

## Remotes

A remote is a IntegraCore server that the app can sync or deploy to. Credentials are managed by the standalone CLI. Use `integracore auth login` and `integracore remote list`.

Common commands:

```bash
# Add a remote interactively.
integracore auth login

# Connect to a local IntegraCore server.
integracore auth login --url http://localhost:2020

# Add a remote non-interactively.
printf '%s' "$INTEGRA_API_KEY" | integracore auth login --with-token --url https://your-integracore-server.com --name production

# List configured remotes.
integracore remote list

# Switch the active remote.
integracore remote use <name>
```

When the user says "prod", "production", or "workspace de prod", identify the target remote before syncing or deploying. If it is missing, add it with `--as production` or the user-provided name.

## Development Sync

Use the bounded apply command to synchronize app changes with the active remote:

```bash
integracore app apply
```

Do not use bare `integracore app dev` (watch mode). Run `integracore app apply` each time changes need to be synced.

Apply requires an authenticated remote. If authentication fails, re-add or switch the remote before retrying.

Use JSON output to inspect structured errors from a bounded apply:

```bash
integracore app apply --json
```

## Troubleshooting

Start by identifying which layer is failing:

- Remote/authentication.
- Dev sync or apply.
- Build/package generation.
- Deploy/upload/install.
- Runtime function execution.
- CI/CD environment or secrets.

Collect the minimum useful context before changing configuration:

```bash
sed -n '1,220p' package.json
sed -n '1,220p' src/application-config.ts
integracore remote list
integracore app apply --json
```

For remote or authentication issues:

- Check that the active remote is the intended workspace or server.
- Re-run `integracore auth login --url http://localhost:2020` for local app-dev servers.
- Re-run `integracore auth login --url <url> --name <name>` for remote servers.
- Avoid overwriting a production remote until the target URL is confirmed.

For sync issues:

- Prefer `integracore app apply --json` to get a bounded failure.
- Check generated type or schema errors before editing app entities.
- If the app depends on a changed data model, use `develop-app` to fix the entity definitions.

## Build, Deploy, Logs, And Exec

Build before deploy when the user asks for release readiness or when debugging packaging issues:

```bash
integracore app build
```

Publish an app to npm, or publish privately to a configured IntegraCore server registry:

```bash
integracore app publish
integracore app publish --private --remote production
integracore app install --remote production
```

Before deploying an update, check that `package.json` has a strictly higher semver `version` than the currently deployed version. Re-deploying the same version is rejected. After a private publish, install the deployed version with `integracore app install` when the target workspace should use it.

Use function logs when debugging runtime behavior on the connected server:

```bash
integracore app logs
integracore app logs --name <function-name>
```

Run a logic function manually when testing behavior without its trigger:

```bash
integracore app exec --name <function-name>
integracore app exec --name <function-name> --payload '{"key":"value"}'
```

Uninstall only after confirmation:

```bash
integracore app uninstall
integracore app uninstall --yes
```

Integration tests install and uninstall the app on their target server, so run them against the isolated test instance (`integracore local start --test`, port `2021`) rather than the dev instance — see `../develop-app/tests.md`.

## Local development environment

`integracore local start` runs a complete local IntegraCore instance, including web UI,
API, worker and databases. Docker must be running with a local socket context.
No app directory or saved remote is required. Login remains separate:
`integracore auth login --url http://localhost:2020 --name local`.

Use `local status`, `local logs` and `local stop` to inspect and stop it.
`start [version]` preserves existing instances. New instances use the explicit
version, the highest published match for `engines.integracore`, or `latest` when no
range exists. `local upgrade [version]` replaces the image while preserving
ports, data volumes and environment overrides. It rejects downgrades and images
without a valid `APP_VERSION` before replacing the existing instance.

Use `--test` consistently for the separate test instance on port `2021`.
`local reset` deletes that selected instance and its data, and requires explicit
approval; do not supply `--yes` without the user's authorization to delete it.
Stopping an instance preserves data. None of these commands changes remotes.

## CI/CD

Apps generated with `integracore app init` can use GitHub Actions for CI and CD. For deployment automation, check the app's `.github/workflows/` files and configure:

- `INTEGRA_DEPLOY_URL`
- `INTEGRA_DEPLOY_API_KEY`

Do not put API keys in source files. Use the repository or CI secret store.

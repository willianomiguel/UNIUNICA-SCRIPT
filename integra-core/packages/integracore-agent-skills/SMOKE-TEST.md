# Self-Hosted Smoke Test

The portable skills claim that a user can scaffold and develop a IntegraCore app against a self-hosted instance. This is how that claim is checked by hand. CI covers installation (`ci-agent-skills.yaml`); this covers the workflow the installed skills describe, which needs a running IntegraCore instance and cannot run on a CI runner.

Run it when `create-app`, `develop-app`, or `manage-app` guidance changes in a way that affects the scaffold or sync flow.

## Install the Distribution

Build from a checkout and install the skills into the agent used for this run:

```bash
npx nx run integracore-agent-skills:build
npx skills add ./packages/integracore-agent-skills/dist --skill create-app develop-app manage-app
```

After the first successful publish from `main`, the same distribution is available at `https://github.com/integracorehq/integracore/tree/agent-skills`. Record the source revision and installation method with each new run.

## 1. Bring up a self-hosted instance

Any instance works. For a local one from a checkout of this repository:

```bash
bash packages/integracore-utils/setup-dev-env.sh
npx nx database:reset integracore-server   # init only builds the schema; reset also seeds
npx nx start integracore-server
```

Wait for `http://localhost:3000/healthz` to return 200. This instance is self-hosted for the purposes of the test: a non-`integracore.com` host, over plain HTTP, on a port the user chose.

## 2. Install the CLI and authenticate a remote

Install the standalone CLI. Create an API key in the target instance's settings, then pass it through standard input:

```bash
npm install -g integracore
printf '%s' "$INTEGRA_API_KEY" | integracore auth login --with-token --url http://localhost:3000 --name selfhosted
```

Use a key issued by this instance, not credentials from another test server. For browser sign-in, omit `--with-token` and the pipe.

## 3. Scaffold, following `create-app`

```bash
integracore app init smoke-crm --display-name "Smoke CRM" --description "Self-hosted smoke test app"
cd smoke-crm
yarn install
integracore app apply --create --remote selfhosted
```

`app init` only creates local files. The first `app apply --create` registers and installs the app. Confirm the app exists on the instance:

```sql
select id, "universalIdentifier", version from core.application;
```

One row must carry the `APPLICATION_UNIVERSAL_IDENTIFIER` from the generated `src/constants/universal-identifiers.ts`.

## 4. Develop, following `develop-app`

From the generated app directory:

```bash
integracore app add object --name ticket --name-plural tickets --create-view --create-navigation-menu-item --create-page-layout --no-input
integracore app apply --remote selfhosted
```

Confirm the apply command succeeds and the entity reached the instance:

```sql
select "nameSingular", "namePlural" from core."objectMetadata" where "nameSingular" = 'ticket';
select table_schema || '.' || table_name from information_schema.tables where table_name ilike '%ticket%';
```

Both must return a row. The second proves the workspace migration ran and the physical table exists, which a successful sync message alone does not.

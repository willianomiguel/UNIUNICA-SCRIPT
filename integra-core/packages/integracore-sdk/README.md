<div align="center">
  <a href="https://integracore.com">
    <picture>
      <img alt="IntegraCore logo" src="https://raw.githubusercontent.com/integracorehq/integracore/main/packages/integracore-website/public/images/core/logo.svg" height="128">
    </picture>
  </a>
  <h1>IntegraCore SDK</h1>

<a href="https://www.npmjs.com/package/integracore-sdk"><img alt="NPM version" src="https://img.shields.io/npm/v/integracore-sdk.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://github.com/integracorehq/integracore/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/next.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://discord.gg/cx5n4Jzs57"><img alt="Join the community on Discord" src="https://img.shields.io/badge/Join%20the%20community-blueviolet.svg?style=for-the-badge&logo=IntegraCore&labelColor=000000&logoWidth=20"></a>

</div>

The application authoring and runtime SDK for [IntegraCore CRM](https://integracore.com).

Use `integracore-sdk/define` to declare app entities, `integracore-sdk/front-component` for UI helpers, and `integracore-sdk/logic-function` for server-side helpers. The SDK also provides `billing`, `utils`, and renderer integration exports.

## Quick start

Install the standalone CLI separately from your app's SDK:

```bash
npm install -g integracore
integracore app init my-integracore-app
cd my-integracore-app
yarn install
integracore auth login --url https://your-workspace.integracore.com
integracore app dev --create
```

Keep `integracore-sdk` installed in each app. The global `integracore` package owns scaffolding, builds, authentication, sync, and publishing.

## Documentation

- [CLI reference](https://docs.integracore.com/developers/extend/apps/operations/cli)
- [Testing apps](https://docs.integracore.com/developers/extend/apps/operations/testing)
- [Logic function inputs](./docs/logic-function-inputs.md)

## Contributing

```bash
yarn install
npx nx build integracore-sdk
npx nx run integracore-sdk:test:unit
```

To work on CLI behavior, use `packages/integracore-cli` and `npx nx build integracore-cli`.

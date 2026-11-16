# Setup

Use o Node.js do `.nvmrc` e o Yarn 4. A CLI vem pelas dependências do projeto (script `integra`):

```bash
yarn install
```

Conecte-se ao servidor existente (URL e chave de API Admin):

```bash
yarn integra auth login --url http://localhost:3000       # ou: echo "$CHAVE" | yarn integra auth login --with-token --url http://localhost:3000
yarn integra app apply --create
yarn integra app dev
```

O primeiro `apply` registra e instala o app. O `dev` acompanha e sincroniza as mudanças seguintes.
O `apply` não autentica nem sobe containers.

## Validação

- `yarn lint`, roda o lint.
- `yarn typecheck`, confere os tipos do código e dos testes.
- `yarn test:unit`, roda os testes unitários.
- `yarn test`, roda os testes de integração contra um workspace descartável configurado com
  `INTEGRA_API_URL` e `INTEGRA_API_KEY`.

Os testes de integração instalam e desinstalam o app. Rode o `apply` em Linux/WSL: no Windows a
validação de caminhos reclama de barras invertidas.

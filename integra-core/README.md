# IntegraCore — motor

Motor da plataforma IntegraCore: monorepo Nx / Yarn 4 com servidor (NestJS, TypeORM, PostgreSQL,
Redis, GraphQL), interface (React), biblioteca de UI, SDK de apps e CLI.

Este diretório é referência. O que roda em produção é a imagem construída em `infra/branding/`, que
aplica a marca sobre o build do front. O código do produto (módulos) fica em `apps/integracore/`, fora
daqui — veja o README da raiz do repositório.

## Pacotes principais

- `packages/integracore-front` — interface (React, Jotai, Linaria, Vite).
- `packages/integracore-server` — API, banco, filas, autenticação e executor de funções.
- `packages/integracore-shared` — tipos e utilitários isomórficos.
- `packages/integracore-ui` — biblioteca de componentes.
- `packages/integracore-sdk` / `packages/integracore-client-sdk` — definição e cliente dos apps.
- `packages/integracore-cli` — CLI de apps (`integra`).
- `packages/integracore-agent-skills` — guia para agentes de IA criarem apps.

## Desenvolvimento do motor

```bash
bash packages/integracore-utils/setup-dev-env.sh   # Postgres/Redis + banco (tarefas que precisam do app rodando)
npx nx start integracore-server
npx nx start integracore-front
npx nx test integracore-server                    # testes unitários do pacote
npx nx build integracore-shared                   # antes de testar pacotes que dependem dele
```

Regras de UI e de código para este checkout: `DESIGN.md`, `CLAUDE.md` e `.claude/skills/`.

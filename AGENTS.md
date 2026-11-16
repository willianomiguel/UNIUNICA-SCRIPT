# AGENTS.md — guia para agentes de IA

Você é um agente configurando ou desenvolvendo a plataforma de gestão IntegraCore.
Leia este arquivo inteiro antes de agir. Visão geral para humanos: [README.md](README.md).

## O que é este repositório

- **Motor** (`integra-core/`) roda em Docker a partir de `infra/`, construído da versão fixada em
  `infra/.env` (`TAG`) com a marca aplicada em `infra/branding/`.
- **Nosso código** é um app em `apps/integracore/` com os módulos em `apps/integracore/src/modules/`
  (projetos, sprints, vendas, financeiro, metas, trafego, docs, avisos, quadros, cofre, assistente). Cada módulo tem README.
- `integra-core/` é o código-fonte do motor, **só para referência**. Nunca edite.
- Versões que precisam andar juntas: `TAG` em `infra/.env` (v2.58.2), pasta `integra-core/`,
  e `integra-sdk` / `integra-client-sdk` / `integra-ui` (2.58.0) em `apps/integracore/package.json`
  (instalados como alias dos pacotes do motor), CLI fixada em `apps/integracore/package.json`.

## Tarefa: instalar em produção numa máquina nova

Pare e pergunte ao humano sempre que precisar de algo que só ele tem: domínio, decisão de expor
na internet, e-mail/senha da conta, chaves de gateways/Meta/GitHub. Nunca invente segredos de terceiros.
Nunca faça commit de `infra/.env` nem de chaves.

### 1. Sistema
- Ubuntu Server 24.04 (ou similar). Instale Docker Engine + plugin Compose (repositório oficial da Docker),
  `git`, `curl`, `openssl`. Habilite o Docker no boot (`systemctl enable --now docker`).
- Node.js **24+** (exigido pela CLI; Node 22 não serve). Ex.: `nvm install 24` ou NodeSource.
- `corepack enable` (o app usa yarn 4.18.1; se `repo.yarnpkg.com` estiver bloqueado,
  exporte `COREPACK_NPM_REGISTRY=https://registry.npmjs.org`).

### 2. Código
```bash
git clone <repo> integracore && cd integracore
```

### 3. Motor (infra)
```bash
cd infra && cp .env.example .env
```
Edite `.env`:
- `PG_DATABASE_PASSWORD` = `openssl rand -hex 32`
- `ENCRYPTION_KEY` = `openssl rand -base64 32` — **guarde num cofre**; sem ela os segredos salvos ficam ilegíveis.
- `SERVER_URL` = URL pública final (ex.: `https://gestao.dominio.com.br`). Ela entra nos links e nos webhooks;
  trocar depois exige reconfigurar os webhooks externos.
- Produção com HTTPS próprio: `DOMINIO=gestao.dominio.com.br` e suba com
  `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build` (Caddy + Let's Encrypt; portas 80/443 abertas e DNS apontado).
- Sem IP público/portas: use **Cloudflare Tunnel** apontando para `http://localhost:3000` e suba só com `docker compose up -d --build`.

Já configurado no `docker-compose.yml` e **não deve ser removido**:
`LOGIC_FUNCTION_TYPE=LOCAL` (sem isso webhooks, crons e automações não rodam) e
`SERVER_INTERNAL_URL=http://server:3000` (sem isso as funções não alcançam a API dentro do Docker → ECONNREFUSED).

Espere o servidor ficar saudável: `docker compose ps` → `server ... (healthy)`; `curl -fsS localhost:3000/healthz`.

### 4. Conta (feito pelo humano no navegador)
1. Abrir `SERVER_URL`, criar conta e workspace.
2. Configurações → **Experiência** → idioma Português (Brasil) (cada membro faz o seu).
3. Configurações → **Desenvolvedores** → criar **chave de API** com papel **Admin**, validade longa.
   Peça ao humano para colar a chave num arquivo local fora do git (ex.: `~/.integracore-api-key`, `chmod 600`).

### 5. Instalar o app
```bash
cd apps/integracore && yarn install
yarn typecheck && yarn lint && yarn test:unit      # tudo deve passar
yarn integra auth login --with-token --url "$SERVER_URL" --name prod --use < ~/.integracore-api-key
yarn integra app apply --create --no-input        # primeira vez; depois use scripts/apply.sh
```

### 6. Dados iniciais
O `apply` **não** roda o post-install. Rode a rota (idempotente, pode repetir):
```bash
curl -fsS -X POST -H "Authorization: Bearer $(cat ~/.integracore-api-key)" "$SERVER_URL/s/integracore/dados-iniciais"
```
Resposta esperada: `{"ok":true,"resultados":[{"modulo":"financeiro","ok":true}]}`.
Só cria dados estruturais (as categorias financeiras padrão). O app **não** instala dados de exemplo.

Depois, tire o **Cofre de acessos** da função padrão "Member" (idempotente; ver `apps/integracore/src/modules/cofre/README.md`):
```bash
SERVER_URL="$SERVER_URL" node scripts/travar-cofre.mjs < ~/.integracore-api-key
```
Quem pode abrir o cofre recebe a função "Membro com cofre" (Configurações → Membros), feito pelo humano.

### 7. Integrações (só com valores fornecidos pelo humano)
Variáveis do app: Configurações → Aplicativos (aba Instalado) → IntegraCore (o caminho no menu pode variar entre versões). Pela API (metadata GraphQL), testado:
```bash
# id do app
curl -s "$SERVER_URL/metadata" -H "Authorization: Bearer $KEY" -H 'content-type: application/json' \
  -d '{"query":"{ findManyApplications { id name } }"}'
# definir uma variável
curl -s "$SERVER_URL/metadata" -H "Authorization: Bearer $KEY" -H 'content-type: application/json' \
  -d '{"query":"mutation{updateOneApplicationVariable(key:\"STRIPE_WEBHOOK_SECRET\",value:\"...\",applicationId:\"<id>\")}"}'
```
Lista de variáveis e endpoints: tabela "Configurar integrações" no README e o README de cada módulo.
Endpoints sem variável respondem 503/401 de propósito (fechados por padrão).
Rotas de servidor (tráfego, GitHub) têm URL `SERVER_URL/webhooks/server/<registrationId>/<functionId>`;
o `registrationId` sai de `select id from core."applicationRegistration"` no Postgres
(`docker compose exec db psql -U postgres -d default`), os ids das funções estão nas constants de cada módulo.

### 8. Operação
- Backup diário: `crontab -e` → `0 3 * * * /caminho/integracore/scripts/backup.sh /caminho/backups`
  e copie a pasta para fora da máquina. Teste uma restauração com `scripts/restore.sh` uma vez.
- Firewall: só 22, 80, 443 (ou nenhuma porta pública com Cloudflare Tunnel). Nunca exponha 5432/6379.
- Verificação final: abrir cada item do menu lateral (Roadmap, Projetos, Ideias, Sprints, Quadro da sprint,
  Painel de Vendas, Vendas, Painel Financeiro, Lançamentos, Painel de metas, Metas, Painel de Tráfego,
  Campanhas de tráfego, Wiki, Quadros, Cofre, Alertas) e confirmar que carregam (vazios, sem dados de exemplo).

## Tarefa: desenvolver

- Regras entre módulos (pastas, IDs, quem é dono de cada relação, posições no menu):
  [docs/CONTRATO-MODULOS.md](docs/CONTRATO-MODULOS.md). IDs de objetos: `apps/integracore/src/modules/shared/constants/objects.ts`.
  **Nunca mude um `universalIdentifier` já sincronizado.**
- Guia do motor para apps (leia antes de mexer): `integra-core/packages/integracore-agent-skills/skills/develop-app/SKILL.md`
  e `integra-core/packages/integracore-agent-skills/references/`. Também `apps/integracore/AGENTS.md`.
- Gere entidades com `yarn integra app add ... --no-input` e mova os arquivos para `src/modules/<modulo>/<tipo>/`.
- Testes unitários: `src/**/__tests__/*.test.ts` (vitest). Um teste por util.
- Antes de commitar: `yarn typecheck && yarn lint && yarn test:unit` em `apps/integracore`, depois `scripts/apply.sh`
  num ambiente de teste e confira no navegador.
- Textos para o usuário em português do Brasil; nomes de API em camelCase sem acento.
- Front components rodam num sandbox (sem `window`/`document` diretos): use `integra-ui` e `CoreApiClient`/`RestApiClient`.

## Armadilhas já conhecidas

- Node < 24 → a CLI recusa rodar.
- Sem `LOGIC_FUNCTION_TYPE=LOCAL` → rotas `/s/...` respondem 403 e nada automático roda.
- Sem `SERVER_INTERNAL_URL` → funções falham com `ECONNREFUSED 127.0.0.1:3000`.
- `yarn integra app apply` não executa o post-install → use a rota de dados iniciais.
- O motor não repassa o cabeçalho `Authorization` para rotas públicas (por isso Pagar.me usa `?token=`).
- Campo chamado `link` é reservado; em campos de objeto use `universalSettings`, não `settings`.
- Aplicar pelo Windows falha na validação de caminhos (barras invertidas). Rode o `apply` em Linux/WSL.

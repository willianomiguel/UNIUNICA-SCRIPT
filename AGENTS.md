# AGENTS.md — guia para agentes de IA

Você é um agente configurando ou desenvolvendo a plataforma de gestão da UniÚnica.
Leia este arquivo inteiro antes de agir. Visão geral para humanos: [README.md](README.md).

## O que é este repositório

- **Twenty** (CRM open source) roda em Docker a partir de `infra/` — imagem oficial `twentycrm/twenty`, versão fixada em `infra/.env` (`TAG`).
- **Nosso código** é um app do Twenty em `apps/uniunica/` com 8 módulos em `apps/uniunica/src/modules/`
  (projetos, sprints, vendas, financeiro, metas, trafego, docs, avisos). Cada módulo tem README.
- `twenty/` é o código-fonte do Twenty como **submódulo, só para referência**. Nunca edite.
- Versões que precisam andar juntas: `TAG` em `infra/.env` (v2.58.2), submódulo `twenty/` (tag `twenty/v2.58.2`),
  e `twenty-sdk` / `twenty-client-sdk` / `twenty-ui` (2.58.0) em `apps/uniunica/package.json`, CLI `twenty@2.58.0`.

## Tarefa: instalar em produção numa máquina nova

Pare e pergunte ao humano sempre que precisar de algo que só ele tem: domínio, decisão de expor
na internet, e-mail/senha da conta, chaves de gateways/Meta/GitHub. Nunca invente segredos de terceiros.
Nunca faça commit de `infra/.env` nem de chaves.

### 1. Sistema
- Ubuntu Server 24.04 (ou similar). Instale Docker Engine + plugin Compose (repositório oficial da Docker),
  `git`, `curl`, `openssl`. Habilite o Docker no boot (`systemctl enable --now docker`).
- Node.js **24+** (exigido pelo CLI `twenty`; Node 22 não serve). Ex.: `nvm install 24` ou NodeSource.
- `corepack enable` (o app usa yarn 4.18.1; se `repo.yarnpkg.com` estiver bloqueado,
  exporte `COREPACK_NPM_REGISTRY=https://registry.npmjs.org`).

### 2. Código
```bash
git clone --recurse-submodules <repo> uniunica && cd uniunica
# se clonou sem submódulos: git submodule update --init --depth 1
```

### 3. Twenty (infra)
```bash
cd infra && cp .env.example .env
```
Edite `.env`:
- `PG_DATABASE_PASSWORD` = `openssl rand -hex 32`
- `ENCRYPTION_KEY` = `openssl rand -base64 32` — **guarde num cofre**; sem ela os segredos salvos ficam ilegíveis.
- `SERVER_URL` = URL pública final (ex.: `https://gestao.dominio.com.br`). Ela entra nos links e nos webhooks;
  trocar depois exige reconfigurar os webhooks externos.
- Produção com HTTPS próprio: `DOMINIO=gestao.dominio.com.br` e suba com
  `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d` (Caddy + Let's Encrypt; portas 80/443 abertas e DNS apontado).
- Sem IP público/portas: use **Cloudflare Tunnel** apontando para `http://localhost:3000` e suba só com `docker compose up -d`.

Já configurado no `docker-compose.yml` e **não deve ser removido**:
`LOGIC_FUNCTION_TYPE=LOCAL` (sem isso webhooks, crons e automações não rodam) e
`SERVER_INTERNAL_URL=http://server:3000` (sem isso as funções não alcançam a API dentro do Docker → ECONNREFUSED).

Espere o servidor ficar saudável: `docker compose ps` → `server ... (healthy)`; `curl -fsS localhost:3000/healthz`.

### 4. Conta (feito pelo humano no navegador)
1. Abrir `SERVER_URL`, criar conta e workspace.
2. Configurações → **Experiência** → idioma Português (Brasil) (cada membro faz o seu).
3. Configurações → **Desenvolvedores** → criar **chave de API** com papel **Admin**, validade longa.
   Peça ao humano para colar a chave num arquivo local fora do git (ex.: `~/.uniunica-api-key`, `chmod 600`).

### 5. Instalar o app
```bash
npm i -g twenty@2.58.0
twenty auth login --with-token --url "$SERVER_URL" --name prod --use < ~/.uniunica-api-key
cd apps/uniunica && yarn install
yarn typecheck && yarn lint && yarn test:unit      # tudo deve passar
twenty app apply --create --no-input              # primeira vez; depois use scripts/apply.sh
```

### 6. Dados iniciais
O `apply` do CLI **não** roda o post-install. Rode a rota (idempotente, pode repetir):
```bash
curl -fsS -X POST -H "Authorization: Bearer $(cat ~/.uniunica-api-key)" "$SERVER_URL/s/uniunica/dados-iniciais"
```
Resposta esperada: `{"ok":true,"resultados":[{"modulo":"financeiro","ok":true}]}`.
Só cria dados estruturais (as categorias financeiras padrão). O app **não** instala dados de exemplo.

Depois, tire o **Cofre de acessos** da função padrão "Member" (idempotente; ver `apps/uniunica/src/modules/cofre/README.md`):
```bash
SERVER_URL="$SERVER_URL" node scripts/travar-cofre.mjs < ~/.uniunica-api-key
```
Quem pode abrir o cofre recebe a função "Membro com cofre" (Configurações → Membros), feito pelo humano.

### 7. Integrações (só com valores fornecidos pelo humano)
Variáveis do app: Configurações → Aplicativos (aba Instalado) → UniÚnica Gestão (o caminho no menu pode variar entre versões). Pela API (metadata GraphQL), testado:
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
- Backup diário: `crontab -e` → `0 3 * * * /caminho/uniunica/scripts/backup.sh /caminho/backups`
  e copie a pasta para fora da máquina. Teste uma restauração com `scripts/restore.sh` uma vez.
- Firewall: só 22, 80, 443 (ou nenhuma porta pública com Cloudflare Tunnel). Nunca exponha 5432/6379.
- Verificação final: abrir cada item do menu lateral (Roadmap, Projetos, Ideias, Sprints, Quadro da sprint,
  Painel de Vendas, Vendas, Painel Financeiro, Lançamentos, Painel de metas, Metas, Painel de Tráfego,
  Campanhas de tráfego, Wiki, Alertas) e confirmar que carregam (vazios, sem dados de exemplo).

## Tarefa: desenvolver

- Regras entre módulos (pastas, IDs, quem é dono de cada relação, posições no menu):
  [docs/CONTRATO-MODULOS.md](docs/CONTRATO-MODULOS.md). IDs de objetos: `apps/uniunica/src/modules/shared/constants/objects.ts`.
  **Nunca mude um `universalIdentifier` já sincronizado.**
- Guia oficial de apps (leia antes de mexer): `twenty/packages/twenty-agent-skills/skills/develop-app/SKILL.md`
  e `twenty/packages/twenty-agent-skills/references/`. Também `apps/uniunica/AGENTS.md`.
- Gere entidades com `twenty app add ... --no-input` e mova os arquivos para `src/modules/<modulo>/<tipo>/`.
- Testes unitários: `src/**/__tests__/*.test.ts` (vitest). Um teste por util.
- Antes de commitar: `yarn typecheck && yarn lint && yarn test:unit` em `apps/uniunica`, depois `scripts/apply.sh`
  num ambiente de teste e confira no navegador.
- Textos para o usuário em português do Brasil; nomes de API em camelCase sem acento.
- Front components rodam num sandbox (sem `window`/`document` diretos): use `twenty-ui` e `CoreApiClient`/`RestApiClient`.

## Armadilhas já conhecidas

- Node < 24 → CLI `twenty` recusa rodar.
- Sem `LOGIC_FUNCTION_TYPE=LOCAL` → rotas `/s/...` respondem 403 e nada automático roda.
- Sem `SERVER_INTERNAL_URL` → funções falham com `ECONNREFUSED 127.0.0.1:3000`.
- `twenty app apply` não executa o post-install → use a rota de dados iniciais.
- O Twenty não repassa o cabeçalho `Authorization` para rotas públicas (por isso Pagar.me usa `?token=`).
- Campo chamado `link` é reservado no Twenty; em campos de objeto use `universalSettings`, não `settings`.

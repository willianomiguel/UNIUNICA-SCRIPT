# UniÚnica — Plataforma de gestão

Sistema interno da UniÚnica para roadmap, projetos, ideias, sprints, vendas, financeiro, metas,
tráfego, wiki e alertas — tudo em um lugar só.

É construído **sobre o [Twenty](https://github.com/twentyhq/twenty)** (CRM open source, AGPL-3.0).
O Twenty fica intacto; tudo que é nosso vive em um app separado (`apps/uniunica`). Assim dá para
atualizar o Twenty sem perder as nossas mudanças.

![Painel de Vendas](docs/telas/06-painel-de-vendas.jpg)

## Módulos

| Módulo | O que faz | Detalhes |
|---|---|---|
| **Projetos** | Roadmap em linha do tempo, Kanban de projetos, Ideias com votação e "transformar em projeto" | [README](apps/uniunica/src/modules/projetos/README.md) |
| **Sprints** | Sprints com burndown, quadro da sprint, código automático nas tarefas (UNI-42), integração com GitHub | [README](apps/uniunica/src/modules/sprints/README.md) |
| **Vendas** | Recebe vendas, recusas, falhas, chargebacks e reembolsos (genérico, Stripe, Mercado Pago, Asaas, Pagar.me) + painel | [README](apps/uniunica/src/modules/vendas/README.md) |
| **Financeiro** | Lançamentos, categorias, recorrências, fluxo de caixa, DRE, orçado x realizado; venda aprovada vira entrada sozinha | [README](apps/uniunica/src/modules/financeiro/README.md) |
| **Metas** | OKRs com progresso e status automáticos (faturamento, vendas, chargeback, leads…) | [README](apps/uniunica/src/modules/metas/README.md) |
| **Tráfego** | Campanhas, métricas diárias, pixel do site, ingestão de dados, Meta Ads, CPA e ROAS cruzando com vendas | [README](apps/uniunica/src/modules/trafego/README.md) |
| **Wiki** | Documentos em árvore com busca e modelos prontos | [README](apps/uniunica/src/modules/docs/README.md) |
| **Alertas** | Regras ("chargeback > 1%", "faturamento do dia < X") enviadas para Slack, Discord, WhatsApp ou webhook | [README](apps/uniunica/src/modules/avisos/README.md) |

Telas de todos os módulos: [`docs/telas/`](docs/telas).

## Estrutura do repositório

```
apps/uniunica/        App do Twenty com todos os módulos (é aqui que vocês programam)
  src/modules/<mod>/  Um módulo por pasta (objetos, telas, funções, testes, README)
infra/                docker-compose do Twenty (+ HTTPS para produção)
scripts/              apply, backup, restore
twenty/               Código-fonte do Twenty (submódulo, versão fixada) — só referência
docs/                 Contrato entre módulos e telas
```

Regras para criar e mudar módulos: [docs/CONTRATO-MODULOS.md](docs/CONTRATO-MODULOS.md).

## Instalação (servidor novo)

Pré-requisitos: Linux com Docker e Docker Compose. Recomendado 4 vCPU, 8–16 GB de RAM, SSD.

```bash
git clone --recurse-submodules <url-deste-repo> uniunica && cd uniunica

# 1. Configurar e subir o Twenty
cd infra
cp .env.example .env
#   edite o .env: PG_DATABASE_PASSWORD (openssl rand -hex 32),
#   ENCRYPTION_KEY (openssl rand -base64 32) e SERVER_URL (ex.: https://gestao.suaempresa.com.br)
docker compose up -d                      # local / rede interna
# produção com HTTPS automático: defina DOMINIO no .env e use
# docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
cd ..
```

2. Abra o `SERVER_URL` no navegador, crie a conta e o workspace.
   Em **Configurações → Experiência** escolha o idioma **Português (Brasil)**.
3. Em **Configurações → Desenvolvedores**, crie uma chave de API (papel **Admin**).
4. Instale o app (precisa de Node.js 24+ na máquina de onde você instala):

```bash
npm i -g twenty@2.58.0
cd apps/uniunica
corepack enable && yarn install
twenty auth login --url <SERVER_URL>       # ou: echo "$CHAVE" | twenty auth login --with-token --url <SERVER_URL>
twenty app apply --create
```

5. Carregue os dados iniciais (categorias, modelos da Wiki, regras de alerta e exemplos):

```bash
curl -X POST -H "Authorization: Bearer $CHAVE" <SERVER_URL>/s/uniunica/dados-iniciais
```

Pode rodar de novo sem medo: não duplica nada. Os registros de exemplo podem ser apagados depois.

## Configurar integrações

As chaves ficam em **Configurações → Aplicativos** (aba Instalado) **→ UniÚnica Gestão**, ou via API (veja o AGENTS.md).
Cada integração só liga quando a variável dela é preenchida (sem ela o endpoint recusa).

| Integração | Variáveis | Endpoint |
|---|---|---|
| Vendas (formato genérico, sua página atual) | — (usa chave de API do Twenty) | `POST /s/vendas/webhook/generico` |
| Stripe | `STRIPE_WEBHOOK_SECRET` | `POST /s/vendas/webhook/stripe` |
| Mercado Pago | `MERCADO_PAGO_ACCESS_TOKEN` (+ `MERCADO_PAGO_WEBHOOK_SECRET`) | `POST /s/vendas/webhook/mercado-pago` |
| Asaas | `ASAAS_WEBHOOK_TOKEN` | `POST /s/vendas/webhook/asaas` |
| Pagar.me | `PAGARME_WEBHOOK_TOKEN` | `POST /s/vendas/webhook/pagarme?token=…` |
| Tráfego (ingestão / Google Ads Script) | `TRAFEGO_INGEST_TOKEN` | ver README do Tráfego |
| Meta Ads (puxa sozinho todo dia) | `META_ADS_ACCESS_TOKEN`, `META_ADS_ACCOUNT_ID` | — |
| GitHub (tarefas andam com os PRs) | `GITHUB_WEBHOOK_SECRET` | ver README de Sprints |
| WhatsApp nos alertas | `WHATSAPP_API_URL`, `WHATSAPP_API_TOKEN`, `WHATSAPP_AUTH_HEADER` | — |

Os webhooks precisam que o servidor seja acessível pela internet (domínio com HTTPS, ou Cloudflare Tunnel).

## Desenvolvimento

```bash
source scripts/dev-env.sh        # Node 24 + yarn 4 (se necessário no seu ambiente)
cd apps/uniunica
yarn typecheck && yarn lint && yarn test:unit
../../scripts/apply.sh           # sincroniza o app com o Twenty ativo
```

- Novas entidades: `twenty app add object|field|logic-function|front-component` e depois mova o arquivo
  para a pasta do módulo. Guia oficial: `twenty/packages/twenty-agent-skills/`.
- Para ver uma mudança: rode `scripts/apply.sh` e recarregue o navegador.

## Operação

- **Backup**: `scripts/backup.sh /caminho/backups` (banco + arquivos; guarda 14 dias). Agende no cron
  do servidor e copie para fora da máquina.
- **Restaurar**: `scripts/restore.sh backups/db-….dump backups/arquivos-….tar.gz`.
- **Atualizar o Twenty**: troque `TAG` no `infra/.env`, o submódulo `twenty/` e as versões de
  `twenty-sdk`, `twenty-client-sdk` e `twenty-ui` em `apps/uniunica/package.json` para a mesma versão;
  `docker compose up -d`, depois `twenty app apply`. Faça backup antes.

## Limitações conhecidas

- **Testado ao vivo:** webhooks genérico, Stripe, Asaas, Pagar.me e GitHub; pixel e ingestão de tráfego;
  as automações entre módulos (venda → lançamento, venda → campanha, tarefa → sprint/projeto); instalação do zero.
- **Não testado com conta real:** Mercado Pago (exige consultar a API deles) e a sincronização do Meta Ads.
- **Rotinas agendadas** (recorrências, metas de hora em hora, burndown diário, alertas a cada 15 min):
  a lógica foi testada, mas não as vimos disparar sozinhas no horário.
- Metas automáticas atualizam de hora em hora (ou na hora, quando a meta é editada), não a cada venda.
- Tema escuro e celular não foram revisados.
- Os gráficos nativos do Twenty mostram o nome do mês em inglês.

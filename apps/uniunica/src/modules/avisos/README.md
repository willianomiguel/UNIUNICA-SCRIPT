# Módulo `avisos` — Alertas

Regras que vigiam números dos outros módulos e avisam no **Slack, Discord, WhatsApp ou webhook genérico**.

## Objeto `alerta`

| Campo | Uso |
|---|---|
| `nome` | Nome da regra |
| `ativo` | Só regras ativas são avaliadas pelo agendamento |
| `metrica` | Ver tabela abaixo |
| `operador` / `limite` | `MAIOR_QUE` ou `MENOR_QUE` (comparação estrita) o limite |
| `janelaDias` | Janela das taxas (ex.: 30 = últimos 30 dias). Métricas "do dia" usam o dia de hoje (horário de São Paulo) |
| `canal` / `destino` | SLACK / DISCORD / WEBHOOK: URL do webhook. WHATSAPP: telefone com DDI (5511999999999) |
| `mensagem` | Modelo com `{nome}` `{valor}` `{limite}` `{metrica}` `{operador}` `{janela}` (vazio = mensagem padrão) |
| `cooldownHoras` | Intervalo mínimo entre dois disparos da mesma regra |
| `ultimoValor`, `ultimaVerificacao`, `ultimoDisparo`, `ultimoErro` | Preenchidos pela automação |

### Métricas

| Métrica | Fonte | Cálculo |
|---|---|---|
| `TAXA_CHARGEBACK` | `venda` (dataEvento na janela) | CHARGEBACK ÷ (APROVADA + REEMBOLSADA + CHARGEBACK) × 100 |
| `TAXA_RECUSA` | `venda` (janela) | (RECUSADA + FALHA) ÷ (aprovadas + reembolsadas + chargeback + recusadas + falhas) × 100 |
| `FATURAMENTO_DIA` | `venda` (hoje) | Soma de `valor` das APROVADA |
| `VENDAS_DIA` | `venda` (hoje) | Quantidade de APROVADA |
| `GASTO_TRAFEGO_DIA` | `metricaTrafego` (`data` = hoje) | Soma de `gasto` |
| `LANCAMENTOS_ATRASADOS` | `lancamento` | status ATRASADO, ou PENDENTE com `vencimento` antes de hoje |
| `METAS_EM_RISCO` | `meta` | status EM_RISCO ou ATRASADA |
| `SPRINT_ATRASADA` | `sprint` | status diferente de CONCLUIDA/CANCELADA e `dataFim` antes de hoje |

Se o objeto de origem não existir (módulo não instalado) ou a leitura falhar, a regra não dispara e o erro fica em `ultimoErro`.

## Automação

- **`avaliar-alertas`** (logic function, cron `*/15 * * * *`): lê as regras ativas, calcula a métrica,
  compara com o limite, respeita `cooldownHoras`, envia e grava `ultimoValor` / `ultimoDisparo` / `ultimoErro`.
- **`testar-alerta`** (rota `POST /s/avisos/testar-alerta`, autenticada; corpo `{ "records": [{ "id": "..." }] }`):
  envia agora uma mensagem "🧪 Teste — …" para o destino, sem olhar condição nem cooldown e sem mexer em `ultimoDisparo`.
- **Ação "Testar alerta"** (menu de comandos ao selecionar registros de Alertas) chama a rota acima e mostra o resultado.

### Payloads enviados

- Slack (incoming webhook): `{ "text": "…" }`
- Discord (webhook): `{ "content": "…", "allowed_mentions": { "parse": [] } }` (cortado em 2000 caracteres)
- Webhook genérico: `{ "evento": "alerta.disparado" | "alerta.teste", "texto", "alerta": { id, nome, metrica, operador, limite, janelaDias }, "valor", "avaliadoEm" }`
- WhatsApp: `POST WHATSAPP_API_URL` com cabeçalho `<WHATSAPP_AUTH_HEADER>: <WHATSAPP_API_TOKEN>` e corpo
  `{ "number", "text", "phone", "message" }` — compatível com **Evolution API** (`/message/sendText/<instância>`, `{number,text}`, header `apikey`)
  e **Z-API** (`/instances/<id>/token/<token>/send-text`, `{phone,message}`, header `Client-Token`). O adaptador fica isolado em
  `clients/send-whatsapp-text.ts` + `utils/build-whatsapp-request.util.ts`.

E-mail não é suportado (use um webhook para um serviço de e-mail, se precisar).

## Variáveis do app

Definidas em `constants/avisos-application-variables.ts` (o integrador junta no `defineApplication`):

- `WHATSAPP_API_URL` (não secreta, padrão vazio) — endpoint "enviar texto".
- `WHATSAPP_API_TOKEN` (secreta) — token do provedor.
- `WHATSAPP_AUTH_HEADER` (não secreta, padrão `apikey`) — nome do cabeçalho do token.

Só são necessárias para o canal WhatsApp.

## Dados iniciais

Nenhum. O módulo começa sem regras de alerta; crie as suas em Alertas.

## Código

- `utils/` — funções puras com testes em `utils/__tests__/*.test.ts` (métricas, regra, cooldown, mensagem, payloads por canal…).
- `data/` — leitura/escrita via API REST (`twenty-client-sdk/rest`), sem tipos gerados, para não depender da ordem de sync dos outros módulos.
- `clients/` — envio HTTP (`fetch`) e adaptador de WhatsApp.

Sem dependências npm.

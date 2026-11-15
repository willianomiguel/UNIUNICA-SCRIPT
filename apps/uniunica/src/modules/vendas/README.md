# Módulo Vendas (Contabilidade)

Substitui a planilha/página manual de contabilidade: toda venda, falha de pagamento, recusa de cartão,
reembolso e chargeback chega sozinha pelos webhooks dos gateways e aparece no **Painel de Vendas**.

## O que o módulo cria

| Item | Descrição |
|---|---|
| Objeto **Venda** (`venda`) | Uma linha por cobrança: descrição/produto, valor bruto, valor líquido, taxa do gateway (BRL), status, gateway, ID no gateway, método, parcelas, cliente, e-mail, data, motivo da recusa e UTMs. |
| Objeto **Evento de pagamento** (`eventoPagamento`) | Registro bruto de **cada** webhook recebido (tipo, gateway, ID, payload JSON, recebido em, processado, erro) ligado à venda (`eventoPagamento.venda` ↔ `venda.eventos`). |
| Visões de Vendas | *Todas as vendas* (tabela), *Por status* (Kanban com soma do valor), *Chargebacks*, *Recusas e falhas*, *Reembolsos*. |
| Visões de Eventos | *Todos os eventos*, *Não processados* (eventos ignorados ou com erro). |
| **Painel de Vendas** (menu, posição 30) | Aba *Resumo*: KPIs com período selecionável (hoje / 7 dias / 30 dias / este mês) e comparação com o período anterior, faturamento por dia, quebras por status/método/gateway e últimos problemas (clicáveis). Aba *Gráficos*: gráficos nativos do Twenty (totais, pizza por status, barras por gateway, método e campanha). |
| Menu | Painel de Vendas (30), Vendas (31), Eventos de pagamento (32). |
| Seed | `seed/seed-vendas.ts` cria 10 vendas `[Exemplo]` (gateways e status variados, IDs `exemplo-001`…`exemplo-010`). É idempotente; apague-as quando entrarem vendas reais. |

### Como as métricas são calculadas (`utils/calcular-metricas-vendas.util.ts`)

- **Venda paga** = status Aprovada, Reembolsada ou Chargeback (o dinheiro foi capturado em algum momento).
- **Faturamento bruto** = soma do valor das vendas pagas.
- **Faturamento líquido** = soma, só das *Aprovadas*, do valor líquido (ou valor − taxa quando o gateway não informa o líquido). Reembolsos e chargebacks não entram.
- **Taxa de aprovação** = pagas ÷ (pagas + recusadas + falhas). Pendentes e canceladas ficam de fora.
- **Taxa de recusa** = (recusadas + falhas) ÷ o mesmo denominador.
- **% chargeback** e **% reembolso** = quantidade ÷ vendas pagas.
- **Ticket médio** = faturamento bruto ÷ vendas pagas.
- Os períodos usam o fuso do navegador; "Hoje" começa à meia‑noite, "7/30 dias" incluem hoje, "Este mês" começa no dia 1.

### Regras de atualização (idempotência)

- A venda é identificada por **gateway + ID no gateway** (`idExterno`). Reenvios do mesmo webhook atualizam a mesma venda.
- Webhooks podem chegar fora de ordem: um status de etapa anterior nunca sobrescreve um de etapa posterior
  (Pendente → Recusada/Falha → Aprovada/Cancelada → Reembolsada → Chargeback). Exceções explícitas: disputa ganha na
  Stripe (volta para Aprovada) e `PAYMENT_RESTORED` no Asaas.
- Só os campos presentes no evento são gravados; um evento de reembolso não apaga cliente, UTMs etc.
- Todo webhook vira um *Evento de pagamento*, inclusive os ignorados (com o motivo em **Erro**), para auditoria.

## Endpoints

Base: `https://<seu-twenty>/s` (local: `http://localhost:3000/s`). Todos aceitam `POST` com JSON.

| Gateway | URL | Autenticação |
|---|---|---|
| Genérico / sistema próprio | `/s/vendas/webhook/generico` | Chave de API do Twenty: `Authorization: Bearer <API_KEY>` |
| Stripe | `/s/vendas/webhook/stripe` | Assinatura `Stripe-Signature` validada com `STRIPE_WEBHOOK_SECRET` |
| Mercado Pago | `/s/vendas/webhook/mercado-pago` | Os dados são buscados na API do MP com `MERCADO_PAGO_ACCESS_TOKEN`; `x-signature` validada se `MERCADO_PAGO_WEBHOOK_SECRET` estiver preenchida |
| Asaas | `/s/vendas/webhook/asaas` | Cabeçalho `asaas-access-token` = `ASAAS_WEBHOOK_TOKEN` |
| Pagar.me (API v5) | `/s/vendas/webhook/pagarme?token=<PAGARME_WEBHOOK_TOKEN>` | Token na URL (o Twenty não repassa o cabeçalho `Authorization` às rotas) |

Respostas: `200` processado ou ignorado (o motivo vem em `mensagem` e fica no evento), `401` autenticação inválida,
`503` variável do gateway não configurada (o webhook é recusado — nunca aceito sem verificação), `500` erro ao gravar
(o gateway tenta de novo; o evento fica registrado com o erro).

### Como configurar cada gateway

**Stripe** — Developers → Webhooks → *Add endpoint* → URL `/s/vendas/webhook/stripe`. Eventos:
`payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_intent.processing`, `payment_intent.canceled`,
`charge.refunded`, `charge.dispute.created`, `charge.dispute.closed`. Copie o *Signing secret* (`whsec_...`) para
`STRIPE_WEBHOOK_SECRET`. A venda usa o ID do PaymentIntent (`pi_...`); reembolsos e disputas apontam para ele.
UTMs/cliente podem ir no `metadata` do PaymentIntent (`utm_source`, `utm_medium`, `utm_campaign`, `cliente_nome`, `produto`).
Reembolso parcial é registrado como evento ignorado (status mantido). A taxa da Stripe não vem no webhook (fica vazia).

**Mercado Pago** — Suas integrações → aplicação → *Webhooks* → URL `/s/vendas/webhook/mercado-pago`, evento
**Pagamentos**. Coloque o *Access token* de produção em `MERCADO_PAGO_ACCESS_TOKEN` e, se quiser validar a assinatura,
a *assinatura secreta* em `MERCADO_PAGO_WEBHOOK_SECRET`. A notificação só traz o ID; o módulo busca o pagamento em
`GET https://api.mercadopago.com/v1/payments/{id}` (taxas = `fee_details`, líquido = `net_received_amount`).
Também aceita IPN antigo (`?topic=payment&id=...`). Status `in_mediation` é tratado como chargeback.

**Asaas** — Integrações → Webhooks → *Webhook para cobranças* → URL `/s/vendas/webhook/asaas`, defina um *Token de
autenticação* e copie o mesmo valor para `ASAAS_WEBHOOK_TOKEN`. Eventos tratados: `PAYMENT_CREATED`,
`PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `PAYMENT_RECEIVED_IN_CASH`, `PAYMENT_OVERDUE` (falha), `PAYMENT_REFUNDED`,
`PAYMENT_CHARGEBACK_REQUESTED`, `PAYMENT_CHARGEBACK_DISPUTE`, `PAYMENT_AWAITING_CHARGEBACK_REVERSAL`,
`PAYMENT_CREDIT_CARD_CAPTURE_REFUSED`, `PAYMENT_REPROVED_BY_RISK_ANALYSIS`, `PAYMENT_DELETED`, `PAYMENT_RESTORED` e
os de análise de risco/autorização (pendente). Taxa = `value − netValue`.

**Pagar.me (v5)** — Configurações → Webhooks → URL `/s/vendas/webhook/pagarme?token=<um segredo longo>` e o mesmo
segredo em `PAGARME_WEBHOOK_TOKEN`. Eventos: `charge.paid`, `charge.payment_failed` (transação `not_authorized`/`refused`
= recusa; demais = falha, motivo em `acquirer_message`), `charge.refunded`, `charge.chargedback`, `charge.pending`,
`charge.processing`, `charge.canceled`. Eventos `order.*` são ignorados (use os de cobrança).

## Formato JSON genérico

Para o sistema atual da UniÚnica (ou n8n/Zapier) enviar vendas diretamente. Crie uma chave em
*Configurações → APIs & Webhooks* do Twenty.

```bash
curl -X POST "https://<seu-twenty>/s/vendas/webhook/generico" \
  -H "Authorization: Bearer $TWENTY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "idExterno": "pedido-1234",
    "status": "APROVADA",
    "gateway": "OUTRO",
    "valor": 497.00,
    "valorLiquido": 472.20,
    "taxaGateway": 24.80,
    "moeda": "BRL",
    "descricao": "Mentoria em grupo",
    "metodoPagamento": "CARTAO_CREDITO",
    "parcelas": 3,
    "clienteNome": "Ana Souza",
    "clienteEmail": "ana@exemplo.com",
    "dataEvento": "2026-11-15T10:30:00-03:00",
    "motivoRecusa": null,
    "utmSource": "instagram",
    "utmMedium": "stories",
    "utmCampaign": "black-friday",
    "tipo": "venda.aprovada"
  }'
```

| Campo | Obrigatório | Observação |
|---|---|---|
| `idExterno` | sim | ID único da cobrança no seu sistema/gateway (alias: `id`). Reenviar o mesmo ID atualiza a venda. |
| `status` | sim | `APROVADA`, `PENDENTE`, `RECUSADA`, `FALHA`, `REEMBOLSADA`, `CHARGEBACK`, `CANCELADA` (também aceita `paid`, `approved`, `refused`, `refunded`, `canceled`…). |
| `gateway` | não | `STRIPE`, `MERCADO_PAGO`, `ASAAS`, `PAGARME`, `MANUAL`, `OUTRO` (padrão `OUTRO`). Faz parte da chave da venda. |
| `valor`, `valorLiquido`, `taxaGateway` | não | Em **reais** (número ou texto `"497,00"`), não em centavos. |
| `moeda` | não | Padrão `BRL`. |
| `descricao` (ou `produto`) | não | Nome exibido da venda. |
| `metodoPagamento` | não | `PIX`, `CARTAO_CREDITO`, `BOLETO`, `OUTRO` (aceita `pix`, `credit_card`, `boleto`…). |
| `parcelas` | não | Inteiro. |
| `clienteNome`, `clienteEmail` | não | |
| `dataEvento` | não | ISO 8601 ou timestamp Unix. Padrão: momento do recebimento. |
| `motivoRecusa` | não | Motivo de recusa/falha/reembolso/chargeback. |
| `utmSource`, `utmMedium`, `utmCampaign` | não | Ou `"utm": { "source", "medium", "campaign" }`. |
| `tipo` | não | Rótulo do evento no log (padrão `venda.<status>`). |
| `forcarStatus` | não | `true` permite voltar o status (ex.: chargeback revertido). |

**Lote / importação de histórico:** envie um array, `{ "vendas": [...] }` ou `{ "eventos": [...] }` (até 100 por
requisição). Com `?formato=stripe|asaas|pagarme|mercado_pago` o mesmo endpoint autenticado aceita eventos no formato
do próprio gateway (para `mercado_pago`, o objeto de pagamento da API `v1/payments`), útil para reprocessar eventos
antigos sem assinatura.

## Variáveis do app

Declaradas em `constants/vendas-application-variables.ts` (o integrador junta em `applicationVariables`):

| Variável | Uso |
|---|---|
| `STRIPE_WEBHOOK_SECRET` | Segredo de assinatura do endpoint Stripe (`whsec_...`). |
| `MERCADO_PAGO_ACCESS_TOKEN` | Access token de produção do Mercado Pago (obrigatório para o endpoint MP). |
| `MERCADO_PAGO_WEBHOOK_SECRET` | Assinatura secreta das notificações (opcional, recomendado). |
| `ASAAS_WEBHOOK_TOKEN` | Token de autenticação do webhook Asaas. |
| `PAGARME_WEBHOOK_TOKEN` | Segredo usado em `?token=` na URL do webhook Pagar.me. |

Todas são secretas. Sem a variável de um gateway, o endpoint dele responde `503` e não grava nada.

## Dependências

Nenhuma dependência npm nova.

## Estrutura

- `objects/`, `fields/` — Venda, Evento de pagamento e a relação entre eles.
- `logic-functions/webhook-*.logic-function.ts` — uma rota por gateway (só autenticação + orquestração).
- `utils/` — adaptadores puros por gateway (`normalizar-evento-stripe`, `normalizar-pagamento-mercado-pago`,
  `normalizar-evento-asaas`, `normalizar-evento-pagarme`, `normalizar-webhook-generico`), verificação de assinatura,
  regras de status/gravação e métricas. Cada um tem teste em `utils/__tests__/`.
- `vendas-client/` — gravação no Twenty (upsert da venda, log do evento), busca no Mercado Pago, leitura do painel.
- `front-components/painel-vendas.front-component.tsx`, `page-layouts/painel-vendas.page-layout.ts` — Painel de Vendas.
- `seed/seed-vendas.ts` — vendas de exemplo.

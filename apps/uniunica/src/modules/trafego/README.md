# Módulo Tráfego

Mostra o tráfego pago e orgânico (Meta Ads, Google Ads, TikTok, site, e-mail…) e o retorno de cada
campanha **cruzado com as vendas reais** do módulo `vendas`.

## O que tem

| Item | Onde |
|---|---|
| Objeto **Campanha** (`campanha`) — nome, plataforma, status, objetivo, orçamento (BRL), datas, `utmCampaign`, ID na plataforma, link | `objects/campanha.object.ts` |
| Objeto **Métrica de tráfego** (`metricaTrafego`) — uma linha por dia por campanha ou por página: impressões, cliques, visitas, leads, conversões, gasto (BRL), origem, página, `chave` | `objects/metrica-trafego.object.ts` |
| Relações `metricaTrafego.campanha ↔ campanha.metricas` e `venda.campanha ↔ campanha.vendas` (dono: tráfego) | `fields/` |
| Views: Todas as campanhas, **Campanhas ativas**, **Por plataforma** (Kanban), **Métricas diárias** | `views/` |
| **Painel de Tráfego** (menu, posição 50): aba *Resumo* (front component com gasto, cliques, leads, vendas, receita, CPA, ROAS por campanha / por dia / por plataforma, filtro 7–90 dias) e aba *Gráficos* (widgets nativos) | `page-layouts/painel-trafego.page-layout.ts`, `front-components/painel-trafego.front-component.tsx` |
| Menu: Painel de Tráfego (50), Campanhas (51), Métricas de tráfego (52) | `navigation-menu-items/` |
| Seed: 2 campanhas de exemplo + 14 dias de métricas (idempotente, pula se já existem) | `seed/seed-trafego.ts` |

### Indicadores

| Indicador | Fórmula |
|---|---|
| CTR | cliques ÷ impressões × 100 |
| CPC | gasto ÷ cliques |
| CPM | gasto ÷ impressões × 1000 |
| CPL | gasto ÷ leads |
| CPA | gasto ÷ vendas aprovadas da campanha (se não houver vendas ligadas, usa as conversões informadas pela plataforma) |
| ROAS | receita das vendas **APROVADAS** ligadas à campanha ÷ gasto |

No painel, a receita considera vendas aprovadas criadas dentro do período escolhido.

## Endpoints públicos

Os endpoints são *server routes* do app. A URL é a que `getServerRouteUrl(<id da função>)`
(de `twenty-sdk/utils`) devolve dentro de uma função do app:

```
<URL do Twenty>/webhooks/server/<applicationRegistrationId>/<universalIdentifier da função>
```

| Endpoint | Função (universalIdentifier) | Métodos |
|---|---|---|
| Ingestão de métricas | `6dd6f4a5-3913-4108-8630-ebfa208be0ad` (`trafego-ingest`) | POST |
| Pixel do site | `aed8df69-c08e-4d62-acca-4a6660b19502` (`trafego-pixel`) | GET, POST |

O `applicationRegistrationId` aparece nos logs do servidor do Twenty (aviso de rota depreciada) ou
em Configurações → Apps. Na instância local de desenvolvimento (verificado):

```
URL_INGEST=http://localhost:3000/webhooks/server/cded0d11-4c1b-4a6e-a5ab-58c37de23340/6dd6f4a5-3913-4108-8630-ebfa208be0ad
URL_PIXEL=http://localhost:3000/webhooks/server/cded0d11-4c1b-4a6e-a5ab-58c37de23340/aed8df69-c08e-4d62-acca-4a6660b19502
```

Para o pixel funcionar a partir do site público, o Twenty precisa estar acessível pela internet
(SERVER_URL público).

### 1. Ingestão (`POST`) — qualquer fonte (Google Ads, TikTok, planilha, Zapier…)

Idempotente: cada linha tem uma `chave`; reenviar o mesmo dia **substitui** os números (não soma).
Se `chave` não vier, ela é montada como `<origem>:<idExterno|utmCampaign|campanhaId|pagina>:<data>`
(ex.: `google:123456:2026-11-14`). Campanhas desconhecidas com `idExterno` ou `nome` são criadas
automaticamente.

```json
{
  "origem": "GOOGLE_ADS",
  "metricas": [
    {
      "data": "2026-11-14",
      "campanha": { "idExterno": "123456", "nome": "Pesquisa de marca", "utmCampaign": "google-marca" },
      "impressoes": 2500,
      "cliques": 120,
      "visitas": 100,
      "leads": 9,
      "conversoes": 2,
      "gasto": 75.4
    }
  ]
}
```

- `origem`: `META_ADS`, `GOOGLE_ADS`, `TIKTOK_ADS`, `SITE` ou `MANUAL` (padrão `MANUAL`; pode vir por linha).
- `data`: `AAAA-MM-DD` (ou `DD/MM/AAAA`). Obrigatória.
- Campanha: objeto `campanha` (`id` do Twenty, `idExterno`, `utmCampaign`, `nome`) ou campos soltos
  `campanhaId`, `idExterno`, `utmCampaign`, `campanhaNome`.
- Números aceitam apelidos em inglês: `impressions`, `clicks`, `visits`, `conversions`, `spend`/`cost`.
  `gasto` em reais (aceita `"75,40"`).
- Também aceita um array solto de linhas. Máx. 2000 linhas por envio.
- Resposta: `{ ok, recebidas, criadas, atualizadas, campanhasCriadas, erros }` (400 se nenhuma linha válida).

Proteção obrigatória: preencha a variável `TRAFEGO_INGEST_TOKEN` e envie o cabeçalho
`x-trafego-token: <token>` (ou `?token=<token>`). Sem a variável o endpoint fica desativado (503).

```bash
curl -X POST "$URL_INGEST" \
  -H 'Content-Type: application/json' \
  -H 'x-trafego-token: SEU_TOKEN' \
  -d '{"origem":"GOOGLE_ADS","metricas":[{"data":"2026-11-14","campanha":{"idExterno":"123456","nome":"Pesquisa de marca"},"impressoes":2500,"cliques":120,"leads":9,"gasto":75.4}]}'
```

#### Google Ads → ingestão (Script do Google Ads)

A API do Google Ads exige developer token aprovado + OAuth, pesado demais para este app. O caminho
simples é um **Script do Google Ads** (Ferramentas → Ações em massa → Scripts) agendado para rodar
todo dia:

```js
var URL_INGEST = 'COLE_AQUI_A_URL_DO_ENDPOINT';
var TOKEN = 'SEU_TOKEN'; // o mesmo de TRAFEGO_INGEST_TOKEN

function main() {
  var query =
    'SELECT campaign.id, campaign.name, segments.date, metrics.impressions, metrics.clicks, ' +
    'metrics.conversions, metrics.cost_micros FROM campaign WHERE segments.date DURING LAST_7_DAYS';
  var rows = AdsApp.search(query);
  var metricas = [];
  while (rows.hasNext()) {
    var r = rows.next();
    metricas.push({
      data: r.segments.date,
      campanha: { idExterno: String(r.campaign.id), nome: r.campaign.name },
      impressoes: Number(r.metrics.impressions),
      cliques: Number(r.metrics.clicks),
      conversoes: Math.round(Number(r.metrics.conversions)),
      gasto: Number(r.metrics.costMicros) / 1e6,
    });
  }
  UrlFetchApp.fetch(URL_INGEST, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-trafego-token': TOKEN },
    payload: JSON.stringify({ origem: 'GOOGLE_ADS', metricas: metricas }),
  });
}
```

Reenviar os últimos 7 dias todo dia é seguro (upsert pela chave) e corrige conversões atrasadas.

### 2. Pixel do site (`GET`/`POST`)

Soma **+1 visita** (ou **+1 clique** com `tipo=clique`) na linha de hoje (horário de Brasília) da
página, origem `SITE`. Com `utm_campaign` igual ao `utmCampaign` de uma campanha, a linha é ligada a
ela (uma linha por página + utm por dia).

Parâmetros: `pagina` (caminho ou URL; se faltar usa o `Referer`), `tipo` (`visita` | `clique`),
`utm_campaign`, `utm_source`, `utm_medium`.

Cole antes de `</body>` na sua página:

```html
<script>
(function () {
  var PIXEL = 'COLE_AQUI_A_URL_DO_PIXEL';
  var q = new URLSearchParams(location.search);
  function enviar(tipo) {
    var p = new URLSearchParams({
      pagina: location.pathname,
      tipo: tipo,
      utm_campaign: q.get('utm_campaign') || '',
      utm_source: q.get('utm_source') || '',
      utm_medium: q.get('utm_medium') || ''
    });
    new Image().src = PIXEL + '?' + p.toString(); // GET simples: não precisa de CORS
  }
  enviar('visita');
  // Conta clique em qualquer link/botão marcado com data-trafego-clique
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-trafego-clique]')) enviar('clique');
  });
})();
</script>
```

Exemplo: `<a href="https://pay.exemplo.com/checkout" data-trafego-clique>Comprar</a>`.

Teste rápido:

```bash
curl "$URL_PIXEL?pagina=/oferta&tipo=visita&utm_campaign=black-friday-2026"
```

## Automação

| Função | Gatilho | O que faz |
|---|---|---|
| `trafego-meta-ads-sync` | cron diário 09:17 UTC (06:17 Brasília) | Busca na Graph API do Meta (`/act_<id>/insights`, nível campanha, por dia) gasto, impressões, cliques no link, leads, compras e landing page views dos últimos 3 dias + hoje, e faz upsert (`meta:<campaign_id>:<data>`). Cria a campanha se o `campaign_id` ainda não existe (pelo `idExterno`). **Sem as variáveis, retorna `IGNORADO` e não faz nada.** |
| `trafego-vincular-vendas-evento` | evento de banco em `venda` (lote) | Venda criada/alterada com `utmCampaign` e sem campanha → liga à campanha de mesmo `utmCampaign` (sem diferenciar maiúsculas/acentos). |
| `trafego-vincular-vendas-cron` | cron de hora em hora (:23) | Mesma ligação para vendas antigas ou campanhas cujo UTM foi preenchido depois. |

Para o casamento funcionar, use nos links dos anúncios `?utm_campaign=<o mesmo utmCampaign da campanha>`
e garanta que o checkout grave o `utmCampaign` na venda (módulo vendas).

## Variáveis do app

Fragmento em `constants/trafego-application-variables.ts` (o integrador junta em
`applicationVariables` do `application-config.ts`):

| Variável | Secreta | Uso |
|---|---|---|
| `META_ADS_ACCESS_TOKEN` | sim | Token (usuário do sistema do Business Manager) com `ads_read`. |
| `META_ADS_ACCOUNT_ID` | não | ID da conta de anúncios, com ou sem `act_`. |
| `TRAFEGO_INGEST_TOKEN` | sim | Obrigatório para o endpoint de ingestão (`x-trafego-token`). Vazio = desativado. |

## Dependências npm

Nenhuma (usa `fetch` e `RestApiClient` do `twenty-client-sdk`).

## Observações

- O incremento do pixel lê e grava (não é atômico); para o volume de um site pequeno basta.
- As funções acessam os dados via GraphQL cru (`services/executar-graphql.service.ts`), sem depender
  do cliente gerado — assim funcionam mesmo antes do cliente conhecer objetos de outros módulos.
- Testes unitários: `src/modules/trafego/utils/__tests__/*.test.ts` (um por util; `yarn test:unit`).

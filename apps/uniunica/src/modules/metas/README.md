# Módulo metas

Metas no estilo OKR com progresso e status calculados automaticamente.

## Objeto
**Meta** (`meta`): título, descrição, responsável (membro do workspace), período (texto, ex. `2026-T4`),
início, fim, valor inicial, valor alvo, valor atual, unidade (Reais, Percentual, Quantidade), fonte do valor,
progresso (%), status (No prazo, Em risco, Atrasada, Concluída), recalculada em, meta principal e submetas.

Relações: `meta.metaPai ↔ meta.submetas` e `meta.responsavel ↔ workspaceMember.metasResponsavel`.

## Fontes automáticas (valor atual)
Calculadas dentro de [início, fim]:
- Faturamento bruto / líquido: soma de `venda.valor` / `venda.valorLiquido` (ou valor) com status APROVADA, por `dataEvento`.
- Vendas aprovadas: quantidade de vendas APROVADA.
- Taxa de chargeback: chargebacks ÷ (aprovadas + reembolsadas + chargeback) × 100.
- Lucro: entradas − saídas pagas no financeiro (por `data`).
- Leads / Cliques: soma de `metricaTrafego.leads` / `cliques` (por `data`).
Se o objeto da fonte não existir, o valor atual não é alterado.

## Regras
- Progresso = (atual − inicial) ÷ (alvo − inicial), limitado a 0–100% (serve para metas de redução).
- Meta com submetas: progresso = média do progresso das submetas (qualquer profundidade).
- Status: ≥ 100% Concluída; prazo vencido → Atrasada; até 10 p.p. abaixo do tempo decorrido → No prazo;
  até metade do esperado → Em risco; abaixo disso → Atrasada.

## Automações
- `metas-recalcular`: de hora em hora (minuto 23).
- `metas-recalcular-ao-alterar`: ao criar/remover uma meta ou mudar valores, datas, fonte ou meta principal.

## Telas (menu, posições 45–46)
- **Painel de metas** (45): metas principais por período, com barra de progresso, marcador de tempo e submetas.
- **Metas** (46): visões Todas, Por período e Por status (kanban). A página da meta tem o widget **Progresso**.

## Dados iniciais
`seed/seed-metas.ts`: OKR do trimestre atual (objetivo + "Faturamento do trimestre" automático + uma meta
manual), sem duplicar (título + período), seguido de um recálculo.

## Testes
`utils/__tests__/*.test.ts` (vitest) — rode com `yarn test:unit`.

## Variáveis e dependências
Nenhuma. Usa utilitários de `src/modules/financeiro/utils` (mesmo autor).

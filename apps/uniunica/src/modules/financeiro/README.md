# Módulo financeiro

Contas a pagar e a receber, fluxo de caixa, DRE simplificada e orçamento por categoria.

## Objetos
- **Lançamento** (`lancamento`): descrição, tipo (Entrada/Saída), valor (R$), data, vencimento, status
  (Pendente, Pago, Atrasado, Cancelado), recorrência (Nenhuma, Semanal, Mensal, Trimestral, Anual), forma de
  pagamento, centro de custo, observações, origem (Manual, Venda, Recorrência), categoria e venda.
  Campos de automação: `chaveIdempotencia`, `recorrenciaRaizId`, `proximaOcorrenciaGerada`.
- **Categoria financeira** (`categoriaFinanceira`): nome, tipo, orçamento mensal (R$), cor, descrição.

Relações deste módulo: `lancamento.categoria ↔ categoriaFinanceira.lancamentos` e
`lancamento.venda ↔ venda.lancamentos` (o campo `lancamentos` na venda é escrito aqui).

## Telas (menu, posições 40–42)
- **Painel Financeiro** (40): totais do mês, entradas x saídas por mês, saídas por categoria e um
  componente com fluxo de caixa (saldo acumulado), DRE do mês e orçado x realizado (com navegação por mês).
- **Lançamentos** (41): visões Todos, Entradas, Saídas, A pagar / atrasados e Por status (kanban).
- **Categorias financeiras** (42).

## Automações
- `financeiro-rotina-diaria` (todo dia 06:17 de Brasília): marca como **Atrasado** o que está Pendente com
  vencimento passado e cria a próxima ocorrência dos lançamentos recorrentes cuja data já chegou.
  Idempotente (`chaveIdempotencia = recorrencia:<raiz>:<data>`); o dia original é mantido (31 → 28/02 → 31/03).
- `financeiro-lancamento-de-venda` (evento em `venda`): venda **APROVADA** → Entrada paga (valor líquido, ou
  bruto), origem Venda, ligada à venda. **REEMBOLSADA/CHARGEBACK** → Saída de estorno (uma por venda, só se a
  entrada existir). Chaves `venda:<id>:entrada` / `venda:<id>:estorno` evitam duplicatas.

## Dados iniciais
`seed/seed-financeiro.ts` (default export, idempotente): 6 categorias padrão (por nome) e 8 lançamentos de
exemplo nos últimos 3 meses (por chave `seed:financeiro:<n>`).

## Variáveis e dependências
Nenhuma variável de ambiente. Nenhuma dependência npm extra.

## Testes
`utils/__tests__/*.spec.ts` (vitest). Observação: `vitest.unit.config.ts` hoje só inclui `*.test.ts`; para
rodar os specs do contrato é preciso incluir `src/**/*.spec.ts` nessa configuração.

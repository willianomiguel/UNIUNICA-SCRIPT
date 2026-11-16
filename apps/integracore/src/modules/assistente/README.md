# Módulo assistente

Transforma o chat de IA nativo do IntegraCore ("Ask AI") no assistente da empresa. Não tem objetos, telas nem item de menu:
só ferramentas (logic functions com `toolTriggerSettings`) e uma skill.

## Ferramentas
Todas devolvem `ok`, `mensagem` (resumo em pt-BR com R$) e os números crus; erro de entrada vira `{ ok: false, erro }`.
- `financeiro_resumo` (`inicio`, `fim`; padrão mês atual): realizado x previsto, em aberto, atrasados, top 5 categorias de despesa.
- `financeiro_lancar` (`descricao`, `valor` em reais, `tipo` ENTRADA|SAIDA, `categoria`, `data`, `vencimento`, `status`, `formaPagamento`, `observacoes`): cria um lançamento.
  Origem fica `MANUAL` (o objeto não tem opção "IA") e as observações levam "Lançado pelo assistente de IA.".
- `metas_situacao` (`status`, `busca`): valor atual/alvo, progresso, dias restantes, falta por dia (recalculado em memória, sem gravar).
- `trafego_desempenho` (`inicio`, `fim`, `campanha`; padrão 30 dias): gasto, receita, ROAS, ROI, CPA, vendas. ROI = (receita - gasto) / gasto, null sem gasto.
- `vendas_resumo` (`inicio`, `fim`; padrão mês atual até hoje): bruto, líquido, ticket, reembolsos, variação vs período anterior, por gateway.
- `sprints_situacao` (`sprintId` opcional): sprint ativa, pontos, ritmo e até 20 tarefas abertas.

Os cálculos reaproveitam os utilitários dos painéis de financeiro, tráfego, vendas, metas e sprints.
Datas em AAAA-MM-DD, fuso de Brasília.

## Skill
`assistente-integracore`: mapa dos objetos, qual ferramenta usar e regras (micros, não apagar sem confirmação, perguntar o que falta).

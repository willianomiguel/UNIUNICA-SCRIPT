# Módulo projetos — Projetos, Roadmap e Ideias

Organiza o que a equipe da UniÚnica está fazendo (projetos), quando (roadmap) e o que
pode vir depois (ideias votadas e priorizadas).

## Menu lateral (posições 10–19)

| Posição | Item | O que abre |
|---|---|---|
| 10 | Roadmap | Página com a linha do tempo (Gantt) dos projetos |
| 11 | Projetos | Objeto Projeto (visões Todos, Kanban por status, Por área, Este trimestre) |
| 12 | Ideias | Objeto Ideia (visões Por pontuação, Kanban por status) |

## Objetos

**Projeto** (`projeto`): nome, descrição (texto rico), status (Ideia, Planejado, Em andamento,
Pausado, Concluído, Cancelado), prioridade (Baixa, Média, Alta, Urgente), área (Desenvolvimento,
Marketing, Estratégia, Financeiro, Operação), responsável (membro do workspace), data de início,
data de fim, progresso (0–100) e trimestre (texto, ex.: `2026-T4`). Relações: `ideias`
(deste módulo); `tarefas` e `sprints` são criadas pelo módulo sprints e `documentos` pelo módulo docs.

**Ideia** (`ideia`): título, descrição (texto rico), autor (membro do workspace), área, status
(Nova, Em análise, Aprovada, Descartada, Virou projeto), impacto (1–5), esforço (1–5), votos,
pontuação (calculada automaticamente; não edite à mão) e projeto (o projeto criado a partir dela).

### Pontuação da ideia

```
pontuação = impacto × (1 + votos) ÷ esforço      (1 casa decimal)
```

Impacto e esforço vazios contam como 3 e são limitados a 1–5; votos vazios ou negativos contam 0.
Exemplos: impacto 5, esforço 1, 2 votos → 15; impacto 2, esforço 4, 0 votos → 0,5.
Código: `utils/calcular-pontuacao-ideia.util.ts`.

## Roadmap

Página em tela cheia (`front-components/roadmap.front-component.tsx`): cada projeto vira uma barra
de `dataInicio` até `dataFim` (fim inclusivo), agrupada por área, colorida pelo status, com a
linha vermelha "hoje" e o progresso como um traço na base da barra. O período mostrado é sempre o
trimestre atual e o próximo, ampliado (em trimestres inteiros, até 8) para caber todos os projetos.
Clicar na barra ou no nome abre o projeto. Projetos sem datas aparecem numa lista no rodapé.
Toda a matemática de posição fica em `utils/` (com testes).

## Ações nas ideias

Aparecem no menu de comandos (e fixadas na barra) ao selecionar uma ou mais ideias:

- **Votar** — soma 1 voto em cada ideia selecionada.
- **Transformar em projeto** — cria um projeto Planejado no trimestre atual com o título, a
  descrição e a área da ideia (prioridade Alta se a pontuação for ≥ 5), liga a ideia ao projeto e
  muda o status para "Virou projeto". Ideias já ligadas a um projeto são ignoradas. Com uma única
  ideia, abre o projeto criado.

A lógica de cada ação fica em `actions/` (`votar-ideias.ts`, `transformar-ideias-em-projeto.ts`,
testadas com um cliente REST falso). O comando roda essa lógica uma vez para todas as ideias
selecionadas, com as permissões de quem clicou, e mostra um resumo no snackbar. A mesma lógica
também está exposta como rotas em lote (corpo `{ "records": [{ "id": "..." }] }`, resposta
`{ ok, total, successCount, skippedCount, failedCount, results[] }`) para API/automações:

| Rota (POST, autenticada) | Função |
|---|---|
| `/s/projetos/ideias/votar` | `logic-functions/votar-ideias.logic-function.ts` |
| `/s/projetos/ideias/transformar-em-projeto` | `logic-functions/transformar-ideias-em-projeto.logic-function.ts` |

## Automação (eventos do banco)

- `recalcular-pontuacao-ideia` (`ideia.*`): recalcula a pontuação; só grava quando muda.
- `recalcular-progresso-projeto` (`task.*`): quando uma tarefa ligada a um projeto (campo
  `Task.projeto`, do módulo sprints) é criada, excluída ou muda de status/projeto, grava
  `progresso = tarefas DONE ÷ total`. Projeto sem tarefas mantém o progresso digitado à mão.
  Se o campo `Task.projeto` não existir, a função não faz nada.

## Dados iniciais

`seed/seed-projetos.ts` (export default, idempotente por nome/título): 6 projetos entre o
4º trimestre de 2026 e o 1º de 2027 e 5 ideias, com o primeiro membro do workspace como
responsável/autor.

## Testes

`utils/__tests__/*.test.ts` e `seed/__tests__/*.test.ts` (vitest): `yarn test:unit`.
(Os testes usam o sufixo `.test.ts` porque é o que `vitest.unit.config.ts` inclui.)

## Variáveis de ambiente e dependências

Nenhuma variável de ambiente e nenhuma dependência npm nova. O acesso a dados usa a API REST
(`RestApiClient` de `twenty-client-sdk/rest`) para não depender do cliente GraphQL gerado.

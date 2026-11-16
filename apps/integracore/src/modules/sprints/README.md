# Módulo `sprints` — Sprints de desenvolvimento

Gestão de sprints do time de dev dentro do IntegraCore, usando o objeto padrão **Tarefa (Task)** como item de trabalho.

## O que tem

### Objeto `sprint` (menu **Sprints**, posição 20)

| Campo | Tipo | Observação |
|---|---|---|
| `nome` | Texto | identificador do registro |
| `objetivo` | Texto | |
| `dataInicio` / `dataFim` | Data | |
| `status` | Seleção | Planejada, Ativa, Concluída, Cancelada (padrão: Planejada) |
| `capacidadePontos` | Número | quantos pontos o time aguenta |
| `pontosTotais` / `pontosConcluidos` | Número | **calculados** pela lógica (não edite à mão) |
| `historicoBurndown` | JSON | fotos diárias `[{ data, pontosRestantes, pontosTotais }]` |
| `precisaEncerrar` | Booleano | marcado pelo cron quando uma sprint ativa passa da data de fim |
| `tarefas` | Relação | ↔ `task.sprint` |
| `projeto` | Relação | ↔ `projeto.sprints` |

### Campos adicionados no objeto padrão Tarefa (Task)

`pontos` (número, story points), `tipo` (Funcionalidade, Bug, Melhoria, Técnico, Outro),
`prioridade` (Baixa, Média, Alta, Urgente), `codigo` (texto, ex. `UNI-42`, gerado automaticamente),
`numero` (número sequencial usado para gerar o código), `prUrl` (link do PR), `branch` (texto),
`concluidaEm` (data/hora, preenchida quando o status vira Concluída).

Relações (dono: sprints, os dois lados estão aqui):
`task.sprint ↔ sprint.tarefas`, `task.projeto ↔ projeto.tarefas`, `task.tarefaPai ↔ task.subtarefas`,
`task.bloqueadaPor ↔ task.bloqueando`, `sprint.projeto ↔ projeto.sprints`.

### Telas

- **Página da sprint**: aba *Resumo* com os campos, o widget **Burndown** (linha ideal tracejada x pontos
  restantes reais, indicadores de pontos, capacidade e dias restantes, aviso "Precisa encerrar"/"Acima da
  capacidade") e a tabela de **Tarefas** da sprint; aba *Linha do tempo*.
- **Quadro da sprint** (menu, posição 21): página com as tarefas da sprint ativa em colunas
  *A fazer / Em andamento / Concluído*, com código, pontos, tipo e prioridade; botões *Voltar/Avançar*
  mudam o status; clicar no título abre a tarefa. Com mais de uma sprint ativa aparece um seletor.
- **Tarefas em sprint** (menu, posição 22): Kanban do objeto Tarefa por status, só com tarefas que estão
  em alguma sprint. (Um filtro fixo "sprint ativa" não é possível numa view estática; por isso existe o Quadro.)
- **Backlog** (menu, posição 23): tabela de tarefas sem sprint que têm `tipo` preenchido.
- **Ações** (na página/seleção de sprints, botões no topo e Cmd+K):
  - **Iniciar sprint** (aparece para sprints Planejadas): status → Ativa, `dataInicio` = hoje se vazia,
    grava a primeira foto do burndown.
  - **Encerrar sprint** (aparece para sprints Ativas, pede confirmação): grava a foto final, move as tarefas
    não concluídas para a próxima sprint **Planejada** (do mesmo projeto, se houver; senão a de início mais
    próximo) ou para o **backlog** (sem sprint), e marca a sprint como Concluída. Depois disso os pontos
    totais da sprint passam a contar só o que ficou nela (o entregue); o histórico do burndown é mantido.

## Lógica (logic functions)

| Função | Gatilho | O que faz |
|---|---|---|
| `sprints-tarefa-criada` | Task criada | gera `numero`/`codigo` (`UNI-<maior número + 1>`), grava `concluidaEm` se já nasce Concluída, recalcula a sprint |
| `sprints-tarefa-atualizada` | Task alterada em `status`, `pontos` ou `sprint` | grava `concluidaEm` ao ir para Concluída (limpa se sair), recalcula a sprint antiga e a nova |
| `sprints-tarefa-removida` / `-restaurada` | Task excluída / restaurada | recalcula a sprint |
| `sprints-burndown-diario` | cron `47 2 * * *` (23:47 em Brasília) | para cada sprint Ativa: recalcula pontos, grava a foto do dia e marca `precisaEncerrar` se `dataFim` já passou (**não encerra sozinha**: o time usa "Encerrar sprint" para decidir o destino das tarefas) |
| `sprints-iniciar-sprint` | `POST /s/sprints/iniciar` (autenticado) | usado pela ação Iniciar; entrada `{ records: [{ id }] }` |
| `sprints-encerrar-sprint` | `POST /s/sprints/encerrar` (autenticado) | usado pela ação Encerrar; entrada `{ records: [{ id }] }` |
| `sprints-github-webhook` | rota de servidor (pública) | recebe o webhook do GitHub, valida a assinatura e enfileira o processamento |
| `sprints-github-processar-evento` | chamada pela rota acima | aplica o evento nas tarefas |
| `sprints-github-webhook-url` | `GET /s/sprints/github-webhook-url` ou `yarn integra app exec` | devolve a URL do webhook |

Toda mudança de pontos/status numa sprint Ativa também atualiza a foto **de hoje** no burndown, então o gráfico
acompanha o dia em tempo real; o cron garante uma foto por dia mesmo sem mudanças.

## Integração com o GitHub

Comportamento:

- Códigos `UNI-<n>` (maiúsculas ou minúsculas) são procurados no **título do PR**, na **branch** e na descrição
  do PR (`pull_request`), e na **branch** e nas **mensagens de commit** (`push`).
- PR aberto / reaberto / pronto para revisão → grava `prUrl` e `branch`, tarefa A fazer → **Em andamento**.
- PR **mergeado** → tarefa → **Concluída** (e `concluidaEm` é preenchido pela lógica de eventos).
- PR fechado sem merge → só atualiza o link, não mexe no status.
- `push` numa branch que não é a principal → grava `branch` e move A fazer → Em andamento.
  Push na branch principal não mexe em nada (só o merge do PR conclui).
- Tarefas já concluídas nunca voltam para Em andamento.

Configuração:

1. Defina a variável do app **`GITHUB_WEBHOOK_SECRET`** (Configurações → Apps → IntegraCore → Variáveis)
   com um segredo longo e aleatório (ex.: `openssl rand -hex 32`).
2. Descubra a URL do webhook: `yarn integra app exec --name sprints-github-webhook-url` (usa `getServerRouteUrl`).
   Ela tem o formato `https://<servidor>/webhooks/server/<id do registro do app>/<id da função sprints-github-webhook>`.
3. No GitHub: repositório → **Settings → Webhooks → Add webhook**
   - *Payload URL*: a URL do passo 2
   - *Content type*: `application/json`
   - *Secret*: o mesmo valor de `GITHUB_WEBHOOK_SECRET`
   - *Which events*: "Let me select individual events" → **Pull requests** e **Pushes**
4. O GitHub manda um `ping`; a rota responde `200 {"ok":true,"mensagem":"pong"}`.

Respostas da rota: `401` assinatura inválida, `503` segredo não configurado, `200 {ignorado:true}` evento sem
código de tarefa, `200 {"queued":true}` evento enfileirado (o processamento roda no worker).

Teste manual com curl (troque `URL` e `SEGREDO`):

```bash
BODY='{"action":"opened","pull_request":{"html_url":"https://github.com/org/repo/pull/1","title":"UNI-1 Teste","merged":false,"head":{"ref":"feature/uni-1"}}}'
SIG="sha256=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$SEGREDO" | sed 's/^.* //')"
curl -i -X POST "$URL" -H 'Content-Type: application/json' \
  -H 'X-GitHub-Event: pull_request' -H "X-Hub-Signature-256: $SIG" --data "$BODY"
```

> Verificado ao vivo (local): assinatura errada → 401, PR aberto → tarefa Em andamento + PR/branch, PR mergeado → Concluída + `concluidaEm` + pontos da sprint.
> A rota de servidor só responde quando o app está registrado e instalado no workspace dono do registro
> (é o caso do `yarn integra app apply` local e da instalação de produção da IntegraCore).

## Variáveis do app

Em `constants/sprints-application-variables.ts` (para o integrador juntar em `applicationVariables`):

```ts
GITHUB_WEBHOOK_SECRET: {
  universalIdentifier: '<SPRINTS_IDS.applicationVariables.githubWebhookSecret>',
  label: 'Segredo do webhook do GitHub',
  description: 'Mesmo valor do campo "Secret" do webhook em GitHub > Settings > Webhooks. ...',
  isSecret: true,
  isRequired: false,
}
```

## Dados iniciais

Nenhum. O módulo começa sem sprints nem tarefas.

## Código

- `constants/sprints-ids.ts` — todos os IDs universais do módulo.
- `utils/` — funções puras com testes em `utils/__tests__/*.test.ts` (códigos, parser de eventos do GitHub,
  assinatura HMAC, pontos, burndown — série ideal/real, escala e caminho SVG —, escolha da próxima sprint…).
- `services/` — acesso à API REST do IntegraCore usado pelas logic functions.
- `front-components/` — Burndown (widget), Quadro da sprint (página), Iniciar/Encerrar (headless + confirmação).
- Sem dependências npm novas (usa `fetch`/`RestApiClient` e `crypto` do Node).

Limitação conhecida: dois cadastros de tarefa exatamente ao mesmo tempo podem receber o mesmo número; corrija
editando o `codigo` de uma delas (a lógica nunca sobrescreve um código existente).

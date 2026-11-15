# Contrato entre os módulos

Todos os módulos vivem em um único app do Twenty: `apps/uniunica`.
Cada módulo tem a sua própria pasta e não mexe na pasta dos outros.

## Pastas

```
apps/uniunica/src/modules/<modulo>/
  objects/                 defineObject (um arquivo por objeto)
  fields/                  defineField: relações e campos em objetos de OUTROS módulos ou padrão (Task, Company…)
  views/                   defineView
  page-layouts/            definePageLayout (página do registro, painéis)
  navigation-menu-items/   defineNavigationMenuItem
  logic-functions/         defineLogicFunction (webhooks, cron, eventos do banco)
  front-components/        defineFrontComponent (.tsx)
  utils/                   funções puras (<nome>.util.ts) + __tests__/<nome>.spec.ts
  types/                   um tipo por arquivo
  constants/               constantes do módulo
  seed/                    seed-<modulo>.ts — dados iniciais (ver "Dados iniciais")
  README.md                o que o módulo faz, como usar, variáveis e endpoints
```

Módulos: `vendas`, `financeiro`, `metas`, `trafego`, `projetos`, `sprints`, `docs`, `avisos`.

## Regras

1. **Objetos**: os IDs e nomes de API de todos os objetos estão em
   `src/modules/shared/constants/objects.ts`. Use exatamente esse `universalIdentifier`,
   `nameSingular` e `namePlural`. Só o módulo dono cria o `defineObject`.
2. **Relações entre módulos**: cada relação tem um dono (tabela abaixo). Só o dono escreve
   os DOIS lados da relação (os dois arquivos de campo), mesmo que um lado fique no objeto de outro módulo.
3. **Rótulos em português** (labels, descrições, opções de select). Nomes de API em camelCase sem acento.
4. **Arquivos compartilhados são do integrador** — não edite: `src/application-config.ts`,
   `src/default-role.ts`, `src/constants/*`, `src/modules/shared/*`, `package.json`.
   Precisa de variável de ambiente (token, segredo, URL)? Crie
   `src/modules/<modulo>/constants/<modulo>-application-variables.ts` exportando (default) o objeto
   no formato de `applicationVariables` do `defineApplication`, e o integrador junta.
   Precisa de dependência npm? Escreva no README do módulo.
5. **Dados iniciais**: não crie post-install. Exporte (default) uma função idempotente em
   `src/modules/<modulo>/seed/seed-<modulo>.ts` com assinatura `async () => Promise<void>`;
   o post-install único do app chama todas.
6. **Menu lateral**: posições reservadas por módulo — projetos 10–19, sprints 20–29, vendas 30–39,
   financeiro 40–44, metas 45–49, tráfego 50–59, docs 60–69, avisos 70–79.
7. **Sync**: use `scripts/apply.sh` (tem trava; só um sync por vez). Se falhar por erro em
   pasta de outro módulo, espere e tente de novo — não corrija arquivo dos outros.

## Donos das relações

| Relação | Dono |
|---|---|
| venda.campanha ↔ campanha.vendas | trafego |
| lancamento.venda ↔ venda.lancamentos | financeiro |
| lancamento.categoria ↔ categoriaFinanceira.lancamentos | financeiro |
| meta.metaPai ↔ meta.submetas | metas |
| ideia.projeto ↔ projeto.ideias | projetos |
| task.sprint ↔ sprint.tarefas | sprints |
| task.projeto ↔ projeto.tarefas | sprints |
| task.tarefaPai ↔ task.subtarefas | sprints |
| sprint.projeto ↔ projeto.sprints | sprints |
| documento.projeto ↔ projeto.documentos | docs |
| documento.documentoPai ↔ documento.subdocumentos | docs |

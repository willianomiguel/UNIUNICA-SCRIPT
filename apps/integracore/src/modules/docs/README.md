# Módulo `docs` — Wiki

Wiki interna dentro da plataforma.

## O que tem

- **Objeto `documento`** (`Documentos` no menu): `titulo`, `conteudo` (texto rico — editor do sistema, guarda markdown),
  `categoria` (Estratégia, Processo, Técnico, Marketing, Financeiro, Ata de reunião, Outro),
  `status` (Rascunho, Publicado, Arquivado), `fixado`, `ordem`.
- **Relações (dono: docs)**: `documento.documentoPai ↔ documento.subdocumentos` (árvore) e
  `documento.projeto ↔ projeto.documentos`.
- **Página "Wiki"** (menu, posição 60): árvore à esquerda (fixados no topo, depois agrupado por categoria;
  filhos pelo `documentoPai`, ordenados por `fixado` → `ordem` → título), busca por título (ignora acento e
  caixa; mostra os ancestrais de quem casa), leitura do conteúdo à direita (markdown renderizado:
  títulos, listas, checklists, citações, código, negrito/itálico/links), caminho (breadcrumb), subdocumentos,
  botão **Editar** (abre o registro, com o editor na aba "Conteúdo") e botão **Novo** (cria um rascunho como filho
  do documento selecionado e abre). Documentos arquivados não aparecem na wiki.
- **Views**: Todos (tabela, por `ordem`), Por categoria (Kanban), Fixados.
- **Menu**: Wiki (60), Documentos (61).

## Dados iniciais

Nenhum. A Wiki começa vazia.

## Código

- `utils/` — funções puras com testes em `utils/__tests__/*.test.ts` (árvore, agrupamento, busca, breadcrumb,
  parser de markdown, parser da resposta REST).
- `front-components/wiki.front-component.tsx` — página; lê os documentos pela API REST (`/rest/documentos`).

Sem variáveis de ambiente e sem dependências npm.

# Módulo Quadros

Quadro branco dentro do sistema, feito com o **Excalidraw** (0.18.1): formas, setas que ligam formas, texto,
desenho livre, imagens, molduras, biblioteca, exportar imagem. Uma IA conectada por MCP também desenha nele.

## Como funciona (2026-11-17)

O front component roda num Web Worker sem `canvas`, então o Excalidraw não cabe nele. Por isso são duas peças:

- **Página do editor** `infra/branding/quadro-excalidraw/` (React + Excalidraw, build Vite em script clássico).
  A imagem da plataforma builda e serve em `/quadro-excalidraw/editor.htm` (estágio `quadro` do `Dockerfile`).
  É `.htm` de propósito: o servidor bloqueia iframe (`X-Frame-Options: DENY`) só para `.html`.
- **Casca** `front-components/quadro-editor.front-component.tsx`: abre a página num iframe (o renderer força
  sandbox sem `allow-same-origin`, origem isolada) e passa no `#hash` o id do quadro, a URL da API, o tema e o
  token de acesso do usuário. O token é renovado a cada 4 min e chega pelo hash sem recarregar o iframe.
  A casca também mantém **Pedir à IA** e o **modo foco** (pílula no canto inferior direito).

A página lê e grava `/rest/quadros/<id>` com o token do usuário (salva ~0,8 s depois da última mudança;
indicador "Salvando… / Salvo / Erro ao salvar / Sessão expirada" no canto superior direito). A cada 4 s ela
confere o `updatedAt`: se outra aba ou a IA mudou o quadro, mescla **elemento a elemento pela versão**
(`reconcileElements` do Excalidraw), sem perder o que você está fazendo. Elementos apagados ficam gravados
por 24 h como "apagados" para a mescla não ressuscitá-los.

Textos criados pelo app (IA e quadros convertidos) chegam com tamanho estimado e a marca
`customData.medirTexto`; a página mede com a fonte de verdade, requebra, centraliza e aumenta a forma se
precisar (`src/medir-textos.ts`).

Mudou a página do editor? `docker compose build server worker && docker compose up -d server worker` em `infra/`.

## Dados

Objeto `quadro` (`/rest/quadros`): `nome`, `descricao`, `cena` (RAW_JSON, o desenho), `conteudo` (RAW_JSON,
formato antigo, só cópia) e `projeto` (relação; este módulo é dono dos dois lados).

```ts
// cena
{ tipo: 'excalidraw', versao: 1, elements: ExcalidrawElement[], appState: { viewBackgroundColor?, gridModeEnabled? }, files: BinaryFiles }
```

**Quadros antigos:** na primeira abertura a casca converte o `conteudo` (editor SVG de 2026-11-15) em `cena`
e grava (`utils/cena-do-conteudo-legado.util.ts`). O `conteudo` fica como estava, como cópia de segurança.

**Ferramentas da IA** continuam calculando no formato simplificado de antes (layout automático, validação,
resumo): `utils/extrair-quadro-resposta.util.ts` monta a visão simplificada da cena
(`converter-de-excalidraw.util.ts`) e `data/gravar-conteudo-quadro.ts` devolve o resultado à cena
(`aplicar-conteudo-na-cena.util.ts` + `converter-para-excalidraw.util.ts`): id novo vira elemento do Excalidraw,
id que sumiu vira "apagado" com versão maior. Losangos, imagens e outras formas aparecem para a IA como retângulo.

Cores da IA = nomes do tema (gray, blue, turquoise, green, yellow, orange, red, pink, purple), desenhadas com a
paleta do Excalidraw (`constants/cores-excalidraw.constant.ts`).

## Edição simultânea

Duas pessoas (ou pessoa + IA) no mesmo quadro: cada editor traz o que o outro gravou em até 4 s e mescla por
elemento. Mexer **no mesmo elemento** ao mesmo tempo: fica a versão mais nova. Não é tempo real (sem cursores).

## IA (MCP)

O IntegraCore tem servidor MCP em `POST <SERVER_URL>/mcp` (JSON-RPC, `Authorization: Bearer <chave>`).
Além do CRUD automático (`find_many_quadros`, `create_one_quadro`…), o módulo publica 4 ferramentas
(logic functions com `toolTriggerSettings`). No MCP elas aparecem com o prefixo `app_`:

| Ferramenta | O que faz |
|---|---|
| `app_quadro_desenhar_diagrama` | Recebe `{ quadroId, nos: [{ id, texto, forma?, cor? }], ligacoes: [{ de, para, texto? }], direcao?: 'direita' \| 'baixo', substituir? }` e faz o layout automático (camadas, sem sobreposição, setas nas bordas). Por padrão desenha ao lado do que já existe. |
| `app_quadro_adicionar_elementos` | Adiciona elementos com posição própria (ajuste fino). |
| `app_quadro_ler` | Resumo legível: elementos, textos, cores, posições e "A → B". |
| `app_quadro_remover_elementos` | Remove elementos por id (e as setas presas a eles). Nunca apaga o quadro. |

A skill `desenhar-no-quadro` ensina a IA a usar essas ferramentas (ler antes de alterar, preferir o diagrama automático, cores permitidas).
Entrada inválida volta `{ ok: false, erro }` e nada é gravado.

Conectar um cliente MCP externo (ex.: Claude Code):

```bash
claude mcp add --transport http integracore http://localhost:3000/mcp --header "Authorization: Bearer <CHAVE_DA_IA>"
```

### Segurança

- Dê à IA **uma chave de API própria com papel restrito** (Configurações → Desenvolvedores; papel só com os
  objetos que ela precisa), **não a chave Admin**. A chave vale para o MCP inteiro (~435 ferramentas), não só para o quadro.
- As ferramentas do quadro só alteram o campo `cena` do quadro informado e **nunca apagam registros**.
  Apagar um quadro inteiro é decisão humana (a skill instrui a IA a não usar `delete_one_quadro`).
- Uma chave por cliente de IA, validade curta, revogar quando não usar; nunca em repositório ou `.env` versionado.
- O texto do quadro volta para a IA em `quadro_ler`: qualquer pessoa do workspace pode escrever ali uma
  "instrução" para a IA. Por isso o papel da chave é a defesa real (sem soft-delete/destroy, sem objetos sensíveis).
- `substituir: true` apaga todo o desenho e **não há cópia no servidor** (o desfazer do editor é só local).
- As funções rodam com o papel padrão do app (lê/atualiza tudo); quem pode chamar a ferramenta pode reescrever qualquer quadro.
- Limites contra abuso: 200 nós/elementos por chamada, 2.000 pontos por traço, ids até 100 caracteres e o JSON do
  quadro até 2 milhões de caracteres (acima disso a ferramenta recusa gravar; o editor não limita, e imagens coladas pesam).

## Próximos passos

- Colaboração em tempo real (cursores, mescla imediata).
- Comentários no quadro.
- Modelos prontos (fluxograma, kanban, mapa mental).

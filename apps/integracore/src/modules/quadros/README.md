# Módulo Quadros

Quadro branco dentro do sistema: caixas, elipses, notas adesivas, textos, setas que ligam formas e
desenho livre, com zoom e arrastar. Uma IA conectada por MCP também desenha nele.

## Visual (2026-11-15)

No estilo do canvas do Claude: o quadro ocupa a aba inteira, com grade de pontos; barra de ferramentas flutuante
embaixo (Selecionar, Mão, Texto, Moldura, Nota, Caneta, Retângulo, Elipse, Seta, cor e **Pedir à IA**); desfazer,
refazer, apagar e zoom (com menu) na pílula do canto superior direito; status de salvamento no canto esquerdo.
- **Moldura** (atalho F): área com título que agrupa cartões; arrastar a moldura leva junto tudo o que está dentro.
  Pega-se pelo título ou pela borda; clicar no miolo vazio seleciona por área.
- **Cartões**: cor sólida do tema; `**Título**` numa linha inteira vira negrito; listas com `1.` ou `-`.
- **Pedir à IA**: rota `POST /s/quadros/ia` (função `quadro-ia-conversar`). Ela lê o quadro, pede à IA do IntegraCore
  (`ai.generate`) um plano em JSON (resposta + diagrama de nós e ligações) e desenha com o mesmo layout automático das
  ferramentas do MCP; o editor recarrega quando termina. Não usa `runAgent`: na 2.58 o agente não recebe as ferramentas
  do app, e o esquema de resposta da IA só aceita campos simples (por isso o diagrama vem como JSON dentro de um texto).
  Precisa de chave de IA no servidor: `OPENAI_API_KEY` ou `ANTHROPIC_API_KEY` no `infra/.env` (o `docker-compose.yml`
  repassa as duas para server e worker). O papel do app tem a permissão `AI`.

## Botão direito

- **Num elemento** (seleciona o que estiver embaixo): Editar texto (Enter), Duplicar (Ctrl+D), Copiar (Ctrl+C),
  Colar (Ctrl+V), Cor ▸, Trazer para a frente (`]`), Enviar para trás (`[`), Agrupar em moldura (Ctrl+G), Apagar.
- **No vazio**: Colar aqui, Nota/Texto/Moldura aqui, Selecionar tudo, Ajustar à tela, Desfazer, Pedir à IA.
- Copiar/colar usa uma área de transferência do próprio quadro (não a do sistema).
- O menu do navegador é bloqueado só dentro da área do quadro (`data-testid="quadro-area-desenho"`) por um script
  que a imagem da plataforma injeta no `index.html` (`infra/branding/aplicar-marca.js`): o worker não consegue
  cancelar o evento a tempo. **Precisa da nossa imagem** (`docker compose build`); com a imagem base o menu do
  quadro abre junto com o do navegador.

## Como usar

- Menu lateral → pasta **Quadros** → **Quadros** (lista). Crie um registro e abra-o.
- Aba **Quadro**: o editor. Aba **Detalhes**: projeto e descrição. Na página do Projeto aparece a relação **Quadros**.
- Ferramentas (atalho): Selecionar (V), Mover a tela (H), Retângulo (R), Elipse (O), Nota adesiva (N),
  Texto (T), Seta (A), Caneta (P).
- Criar: escolha a ferramenta e arraste (um clique cria no tamanho padrão). Nota e texto já abrem para digitar.
- Duplo clique numa forma ou seta edita o texto; duplo clique no vazio cria um texto. Esc ou Ctrl+Enter confirma.
- Seta: comece em cima de uma forma e solte em outra — ela fica presa e acompanha quando as formas mexem.
- Selecionar: clique, Shift+clique soma, arrastar no vazio seleciona por área, Ctrl+A tudo. Alças nos cantos redimensionam.
- Delete/Backspace apaga; Ctrl+Z desfaz; Ctrl+Shift+Z ou Ctrl+Y refaz.
- Roda do mouse = zoom no cursor. Espaço + arrastar, botão do meio ou a ferramenta Mão = mover a tela.
- Cor: escolha na barra; com algo selecionado, a cor muda nos selecionados.
- Salva sozinho ~0,8 s depois da última mudança. Indicador: "Salvando…", "Salvo", "Alterações não salvas",
  "Erro ao salvar" (com "Tentar de novo").

## Edição simultânea (v1)

Vale **o último a salvar**. O editor confere o `updatedAt` a cada 4 s (quando ninguém está arrastando):
- sem edição local pendente → recarrega sozinho (é assim que o desenho da IA aparece);
- com edição pendente → mostra "Quadro atualizado" com o botão **Recarregar** (que descarta o que não foi salvo).
Se não recarregar, a sua próxima gravação sobrescreve a mudança da outra pessoa/IA.

## Dados

Objeto `quadro` (`/rest/quadros`): `nome`, `descricao`, `conteudo` (RAW_JSON), `projeto` (relação; este módulo é dono dos dois lados).

```ts
{ versao: 1, elementos: Elemento[], camera?: { x, y, zoom } }
// Elemento: id (uuid v4), tipo, x, y, largura, altura, cor, z
// retangulo | elipse | nota | texto: + texto
// seta: + pontos [[x,y],[x,y]] absolutos, deId?, paraId? (presa a formas), texto?
// traco: + pontos (simplificados ao salvar)
```

Cores = nomes do tema: gray, blue, turquoise, green, yellow, orange, red, pink, purple.
Toda leitura passa por `utils/normalizar-conteudo-quadro.util.ts`, que aceita JSON velho ou corrompido sem quebrar a tela.
Limites: aviso acima de 2.000 elementos, máximo 10.000; texto até 500 caracteres; zoom de 10% a 400%.

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
- As ferramentas do quadro só alteram o campo `conteudo` do quadro informado e **nunca apagam registros**.
  Apagar um quadro inteiro é decisão humana (a skill instrui a IA a não usar `delete_one_quadro`).
- Uma chave por cliente de IA, validade curta, revogar quando não usar; nunca em repositório ou `.env` versionado.
- O texto do quadro volta para a IA em `quadro_ler`: qualquer pessoa do workspace pode escrever ali uma
  "instrução" para a IA. Por isso o papel da chave é a defesa real (sem soft-delete/destroy, sem objetos sensíveis).
- `substituir: true` apaga todo o desenho e **não há cópia no servidor** (o desfazer do editor é só local).
- As funções rodam com o papel padrão do app (lê/atualiza tudo); quem pode chamar a ferramenta pode reescrever qualquer quadro.
- Limites contra abuso: 200 nós/elementos por chamada, 2.000 pontos por traço, ids até 100 caracteres e o JSON do
  quadro até 2 milhões de caracteres (acima disso a ferramenta e o editor recusam gravar).

## Limitações do sandbox (por que é SVG)

O front component roda num Web Worker com DOM remoto: sem `canvas` (nada de Excalidraw/tldraw), sem `<tspan>`
(uma `<text>` por linha, quebra estimada em `utils/quebrar-texto-quadro.util.ts`), sem medir texto e sem
pointer capture fora de sliders. Testado na tela (2026-11-15):
- `offsetX/offsetY` chegam sempre **0**. A posição vem de `clientX/Y` menos o canto da área de desenho
  (`getBoundingClientRect`, que o renderer simula só para elementos com `ResizeObserver`).
- `autoFocus` não funciona: o campo de texto é focado com `ref.focus()` depois de aparecer.
- Cada evento atravessa o worker: durante arrastes a tela é atualizada no máximo uma vez por quadro (~60/s),
  e o gesto termina no `pointerup` (ou no primeiro movimento com o botão já solto).
- `console.log` do worker não aparece no console da página; para depurar, escreva na própria tela.

## Próximos passos (fora da v1)

- Edição simultânea em tempo real (hoje é "último a salvar").
- Comentários no quadro.
- Exportar PNG/SVG.
- Modelos prontos (fluxograma, kanban, mapa mental).

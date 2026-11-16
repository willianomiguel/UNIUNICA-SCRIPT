import { defineSkill } from 'twenty-sdk/define';

import { CORES_QUADRO } from 'src/modules/quadros/constants/cores-quadro.constant';
import { LIMITES_QUADRO } from 'src/modules/quadros/constants/limites-quadro.constant';
import { QUADROS_UNIVERSAL_IDENTIFIERS } from 'src/modules/quadros/constants/quadros-universal-identifiers';

export default defineSkill({
  universalIdentifier: QUADROS_UNIVERSAL_IDENTIFIERS.skill,
  name: 'desenhar-no-quadro',
  label: 'Desenhar no quadro',
  description: 'Ensina a desenhar diagramas e ler/alterar o quadro branco (objeto quadro) com as ferramentas quadro_*.',
  icon: 'IconLayoutBoard',
  content: [
    'Você desenha no quadro branco do app (objeto `quadro`) do mesmo jeito que se desenha um diagrama no chat.',
    '',
    'Como achar o quadro:',
    '- Use `find_many_quadros` (filtre por nome) para obter o `id`. Se houver mais de um candidato, pergunte qual.',
    '- Nunca apague um quadro inteiro (nem com delete_one_quadro): isso é decisão do usuário.',
    '',
    'Ferramentas (no MCP aparecem com o prefixo `app_`, ex.: `app_quadro_ler`):',
    '- `quadro_ler`: leia o quadro ANTES de alterar. Devolve elementos com id, texto, cor, posição e as ligações "A → B".',
    '- `quadro_desenhar_diagrama`: PREFIRA esta e deixe o layout com o app. Você manda `nos` ({ id, texto, forma?, cor? }) e `ligacoes` ({ de, para, texto? }); o app faz camadas, evita sobreposição e ancora as setas. `direcao`: "direita" (padrão) ou "baixo". Por padrão o diagrama entra ao lado/abaixo do desenho existente; `substituir: true` apaga tudo e só deve ser usado se o usuário pediu para refazer o quadro.',
    '- `quadro_adicionar_elementos`: só para ajustes finos com posição própria (uma nota, um texto solto, uma seta extra). Setas podem usar `deId`/`paraId` (ids de formas) em vez de `pontos`.',
    '- `quadro_remover_elementos`: remove por id (de quadro_ler). Setas presas às formas removidas saem juntas.',
    '',
    'Formato do conteúdo (campo `conteudo` do quadro, só para entender; não edite o JSON na mão):',
    '- `{ versao: 1, elementos: [...], camera? }`.',
    '- Tipos: retangulo, elipse, nota, texto, seta, traco. Cada elemento tem id, x, y, largura, altura, cor, z. Formas têm `texto`. Setas têm `pontos` absolutos [[x,y],[x,y]], `deId`/`paraId` opcionais e `texto` opcional.',
    '',
    `Cores permitidas (nomes do tema): ${CORES_QUADRO.map((cor) => `${cor.valor} (${cor.rotulo})`).join(', ')}. Qualquer outra cor é rejeitada.`,
    `Texto: no máximo ${LIMITES_QUADRO.textoMaximo} caracteres por caixa; prefira frases curtas (até uns 60). Textos longos viram caixas enormes.`,
    '',
    'Boas práticas:',
    '- Ids de nós curtos e únicos ("a", "pagamento"); eles só valem dentro da chamada. A resposta devolve `mapaIds` (id seu -> id no quadro).',
    '- Use cor com sentido (verde para sucesso, vermelho para erro/risco, amarelo para atenção) e elipse para início/fim.',
    '- Máximo de 200 nós por diagrama; divida diagramas grandes em partes.',
    '- Se a ferramenta devolver `ok: false`, leia `erro`, corrija a entrada e tente de novo; nada foi gravado.',
  ].join('\n'),
});

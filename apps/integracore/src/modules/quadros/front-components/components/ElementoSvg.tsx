import { memo } from 'react';
import { type ThemeType } from 'integra-ui/theme';

import { type CorQuadro } from 'src/modules/quadros/types/cor-quadro';
import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';
import { type PontoQuadro } from 'src/modules/quadros/types/ponto-quadro';
import { quebrarTextoQuadro } from 'src/modules/quadros/utils/quebrar-texto-quadro.util';
import { ALTURA_TITULO_MOLDURA } from 'src/modules/quadros/utils/testar-acerto-quadro.util';

export const TAMANHO_FONTE_QUADRO = 14;
const ALTURA_LINHA = 1.4;
const PADDING_TEXTO = 14;
const TAMANHO_PONTA_SETA = 10;

export type EsquemaCor = 'light' | 'dark';

type CoresElemento = { preenchimento: string; borda: string; texto: string };

// Cartões no estilo do canvas do Claude: cor sólida (passo 9 do tema) com texto escuro no tema escuro;
// cinza vira "papel" claro. O texto troca conforme o tema para continuar legível.
export const coresDoElemento = (cor: CorQuadro, theme: ThemeType, esquema: EsquemaCor): CoresElemento => {
  const escuro = theme.color.gray1;
  const claro = theme.color.gray12;

  if (cor === 'gray') {
    return esquema === 'dark'
      ? { preenchimento: theme.color.gray12, borda: 'none', texto: escuro }
      : { preenchimento: theme.color.gray3, borda: theme.color.gray6, texto: claro };
  }

  const solida = theme.color[`${cor}9`];
  const textoEmCorClara = cor === 'yellow' || cor === 'orange';

  return {
    preenchimento: solida,
    borda: 'none',
    texto: esquema === 'dark' ? escuro : textoEmCorClara ? claro : escuro,
  };
};

type ElementoSvgProps = {
  elemento: ElementoQuadro;
  theme: ThemeType;
  esquema: EsquemaCor;
  ocultarTexto?: boolean;
};

type Linha = { texto: string; negrito: boolean };

// "**Título**" numa linha inteira vira negrito; o resto é texto normal (listas "1." e "-" ficam como estão).
const linhasFormatadas = (texto: string, largura: number, maximoLinhas: number): Linha[] => {
  const linhas: Linha[] = [];

  for (const paragrafo of texto.split('\n')) {
    const negrito = /^\*\*.+\*\*$/.test(paragrafo.trim());
    const limpo = negrito ? paragrafo.trim().slice(2, -2) : paragrafo;

    for (const linha of quebrarTextoQuadro(limpo, largura, TAMANHO_FONTE_QUADRO)) {
      linhas.push({ texto: linha, negrito });
    }
  }

  if (linhas.length > maximoLinhas) {
    const cortadas = linhas.slice(0, maximoLinhas);

    cortadas[maximoLinhas - 1] = { ...cortadas[maximoLinhas - 1], texto: `${cortadas[maximoLinhas - 1].texto}…` };

    return cortadas;
  }

  return linhas;
};

const BlocoDeTexto = ({
  texto,
  x,
  y,
  largura,
  altura,
  cor,
  fonte,
  centralizar,
}: {
  texto: string;
  x: number;
  y: number;
  largura: number;
  altura: number;
  cor: string;
  fonte: string;
  centralizar: boolean;
}) => {
  if (texto.trim() === '') {
    return null;
  }

  const alturaLinha = TAMANHO_FONTE_QUADRO * ALTURA_LINHA;
  const maximoLinhas = Math.max(1, Math.floor((altura - PADDING_TEXTO) / alturaLinha));
  const linhas = linhasFormatadas(texto, Math.max(largura - PADDING_TEXTO * 2, 10), maximoLinhas);
  const topo = centralizar ? y + (altura - linhas.length * alturaLinha) / 2 : y + PADDING_TEXTO * 0.7;

  // O sandbox não tem <tspan>: uma <text> por linha.
  return (
    <g style={{ pointerEvents: 'none' }}>
      {linhas.map((linha, indice) => (
        <text
          key={indice}
          x={centralizar ? x + largura / 2 : x + PADDING_TEXTO}
          y={topo + alturaLinha * indice + alturaLinha * 0.75}
          textAnchor={centralizar ? 'middle' : 'start'}
          style={{
            fill: cor,
            fontSize: TAMANHO_FONTE_QUADRO,
            fontWeight: linha.negrito ? 600 : 400,
            fontFamily: fonte,
            userSelect: 'none',
          }}
        >
          {linha.texto}
        </text>
      ))}
    </g>
  );
};

const pontaDaSeta = (de: PontoQuadro, para: PontoQuadro): string => {
  const angulo = Math.atan2(para[1] - de[1], para[0] - de[0]);
  const abertura = Math.PI / 7;
  const esquerda: PontoQuadro = [
    para[0] - TAMANHO_PONTA_SETA * Math.cos(angulo - abertura),
    para[1] - TAMANHO_PONTA_SETA * Math.sin(angulo - abertura),
  ];
  const direita: PontoQuadro = [
    para[0] - TAMANHO_PONTA_SETA * Math.cos(angulo + abertura),
    para[1] - TAMANHO_PONTA_SETA * Math.sin(angulo + abertura),
  ];

  return [para, esquerda, direita].map(([x, y]) => `${x},${y}`).join(' ');
};

const ElementoSvgBase = ({ elemento, theme, esquema, ocultarTexto = false }: ElementoSvgProps) => {
  const fonte = theme.font.family;
  const corLinha = elemento.cor === 'gray' ? theme.font.color.tertiary : theme.color[`${elemento.cor}9`];

  if (elemento.tipo === 'traco') {
    return (
      <polyline
        points={elemento.pontos.map(([x, y]) => `${x},${y}`).join(' ')}
        style={{ fill: 'none', stroke: corLinha, strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}
      />
    );
  }

  if (elemento.tipo === 'seta') {
    const pontos = elemento.pontos;
    const fim = pontos[pontos.length - 1];
    const penultimo = pontos[pontos.length - 2];
    const meio: PontoQuadro = [(pontos[0][0] + fim[0]) / 2, (pontos[0][1] + fim[1]) / 2];
    const rotulo = elemento.texto ?? '';
    const larguraRotulo = Math.min(rotulo.length * TAMANHO_FONTE_QUADRO * 0.56 + 16, 260);

    return (
      <g>
        <polyline
          points={pontos.map(([x, y]) => `${x},${y}`).join(' ')}
          style={{ fill: 'none', stroke: corLinha, strokeWidth: 1.5, strokeLinecap: 'round' }}
        />
        <polygon points={pontaDaSeta(penultimo, fim)} style={{ fill: corLinha }} />
        {rotulo !== '' && !ocultarTexto && (
          <g>
            <rect
              x={meio[0] - larguraRotulo / 2}
              y={meio[1] - 12}
              width={larguraRotulo}
              height={24}
              rx={12}
              style={{ fill: theme.background.secondary, stroke: theme.border.color.medium, strokeWidth: 1 }}
            />
            <text
              x={meio[0]}
              y={meio[1] + 4.5}
              textAnchor="middle"
              style={{ fill: theme.font.color.secondary, fontSize: 12, fontFamily: fonte, pointerEvents: 'none' }}
            >
              {rotulo.length > 40 ? `${rotulo.slice(0, 39)}…` : rotulo}
            </text>
          </g>
        )}
      </g>
    );
  }

  const texto = ocultarTexto ? '' : elemento.texto;
  const { x, y, largura, altura } = elemento;

  if (elemento.tipo === 'moldura') {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={largura}
          height={altura}
          rx={12}
          style={{ fill: theme.background.transparent.lighter, stroke: theme.border.color.medium, strokeWidth: 1 }}
        />
        {texto !== '' && (
          <text
            x={x + 4}
            y={y - ALTURA_TITULO_MOLDURA / 2 + 5}
            style={{ fill: theme.font.color.primary, fontSize: 15, fontWeight: 600, fontFamily: fonte, pointerEvents: 'none' }}
          >
            {texto.split('\n')[0].replace(/\*\*/g, '')}
          </text>
        )}
      </g>
    );
  }

  if (elemento.tipo === 'texto') {
    return (
      <g>
        {/* Retângulo invisível para dar área de clique ao texto. */}
        <rect x={x} y={y} width={largura} height={altura} style={{ fill: 'transparent' }} />
        <BlocoDeTexto
          texto={texto}
          x={x - PADDING_TEXTO}
          y={y - PADDING_TEXTO * 0.4}
          largura={largura + PADDING_TEXTO * 2}
          altura={altura + PADDING_TEXTO}
          cor={elemento.cor === 'gray' ? theme.font.color.primary : theme.color[`${elemento.cor}9`]}
          fonte={fonte}
          centralizar={false}
        />
      </g>
    );
  }

  const cores = coresDoElemento(elemento.cor, theme, esquema);
  const contorno = { fill: cores.preenchimento, stroke: cores.borda, strokeWidth: cores.borda === 'none' ? 0 : 1 };

  if (elemento.tipo === 'elipse') {
    return (
      <g>
        <ellipse cx={x + largura / 2} cy={y + altura / 2} rx={largura / 2} ry={altura / 2} style={contorno} />
        <BlocoDeTexto
          texto={texto}
          x={x + largura * 0.12}
          y={y}
          largura={largura * 0.76}
          altura={altura}
          cor={cores.texto}
          fonte={fonte}
          centralizar
        />
      </g>
    );
  }

  return (
    <g>
      <rect x={x} y={y} width={largura} height={altura} rx={elemento.tipo === 'nota' ? 4 : 10} style={contorno} />
      <BlocoDeTexto
        texto={texto}
        x={x}
        y={y}
        largura={largura}
        altura={altura}
        cor={cores.texto}
        fonte={fonte}
        centralizar={elemento.tipo === 'retangulo' && !texto.includes('\n')}
      />
    </g>
  );
};

export const ElementoSvg = memo(ElementoSvgBase);

import { LIMITES_QUADRO } from 'src/modules/quadros/constants/limites-quadro.constant';
import { type AlcaRedimensionar } from 'src/modules/quadros/types/alca-redimensionar';
import { type CaixaQuadro } from 'src/modules/quadros/types/caixa-quadro';
import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';
import { type PontoQuadro } from 'src/modules/quadros/types/ponto-quadro';

export const posicaoDaAlca = (caixa: CaixaQuadro, alca: AlcaRedimensionar): PontoQuadro => [
  alca === 'no' || alca === 'so' ? caixa.x : caixa.x + caixa.largura,
  alca === 'no' || alca === 'ne' ? caixa.y : caixa.y + caixa.altura,
];

// Arrasta o canto `alca` até `ponto`, mantendo o canto oposto fixo e um tamanho mínimo.
export const redimensionarCaixa = (
  caixa: CaixaQuadro,
  alca: AlcaRedimensionar,
  ponto: PontoQuadro,
  minimo: number = LIMITES_QUADRO.tamanhoMinimo,
): CaixaQuadro => {
  const fixoX = alca === 'no' || alca === 'so' ? caixa.x + caixa.largura : caixa.x;
  const fixoY = alca === 'no' || alca === 'ne' ? caixa.y + caixa.altura : caixa.y;
  const paraEsquerda = alca === 'no' || alca === 'so';
  const paraCima = alca === 'no' || alca === 'ne';
  const largura = Math.max(minimo, paraEsquerda ? fixoX - ponto[0] : ponto[0] - fixoX);
  const altura = Math.max(minimo, paraCima ? fixoY - ponto[1] : ponto[1] - fixoY);

  return {
    x: paraEsquerda ? fixoX - largura : fixoX,
    y: paraCima ? fixoY - altura : fixoY,
    largura,
    altura,
  };
};

// Aplica a nova caixa ao elemento; seta/traço têm os pontos escalados junto.
export const aplicarCaixa = (elemento: ElementoQuadro, nova: CaixaQuadro): ElementoQuadro => {
  if (elemento.tipo !== 'seta' && elemento.tipo !== 'traco') {
    return { ...elemento, ...nova };
  }

  const escalaX = elemento.largura === 0 ? 1 : nova.largura / elemento.largura;
  const escalaY = elemento.altura === 0 ? 1 : nova.altura / elemento.altura;
  const pontos: PontoQuadro[] = elemento.pontos.map(([x, y]) => [
    nova.x + (x - elemento.x) * escalaX,
    nova.y + (y - elemento.y) * escalaY,
  ]);

  return { ...elemento, ...nova, pontos };
};

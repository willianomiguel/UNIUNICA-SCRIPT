import { COR_PADRAO_QUADRO } from 'src/modules/quadros/constants/cores-quadro.constant';
import { type CaixaQuadro } from 'src/modules/quadros/types/caixa-quadro';
import { type DiagramaQuadro } from 'src/modules/quadros/types/diagrama-quadro';
import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';
import { type PontoQuadro } from 'src/modules/quadros/types/ponto-quadro';
import { type ResultadoLayoutDiagrama } from 'src/modules/quadros/types/resultado-layout-diagrama';
import { atualizarSetasLigadas, centroDaCaixa } from 'src/modules/quadros/utils/ancorar-seta.util';
import { caixaDosElementos } from 'src/modules/quadros/utils/caixa-dos-elementos.util';
import { gerarIdQuadro } from 'src/modules/quadros/utils/gerar-id-quadro.util';

const PX_POR_CARACTERE = 8;
const COLUNAS_POR_LINHA = 24;
const LARGURA_MINIMA = 160;
const ALTURA_MINIMA = 64;
const PADDING = 32;
const ALTURA_DA_LINHA = 20;
const FOLGA_ENTRE_CAMADAS = 80;
const FOLGA_NA_CAMADA = 40;

type Tamanho = { largura: number; altura: number };

// Quebra o texto em linhas de até ~24 caracteres (palavras muito longas são partidas).
export const quebrarTextoQuadro = (texto: string, colunas = COLUNAS_POR_LINHA): string[] => {
  const linhas: string[] = [];

  for (const paragrafo of texto.split('\n')) {
    let atual = '';

    for (const palavra of paragrafo.split(/\s+/).filter((parte) => parte !== '')) {
      let resto = palavra;

      while (resto.length > colunas) {
        if (atual !== '') {
          linhas.push(atual);
          atual = '';
        }
        linhas.push(resto.slice(0, colunas));
        resto = resto.slice(colunas);
      }

      if (atual === '') {
        atual = resto;
      } else if (atual.length + 1 + resto.length <= colunas) {
        atual = `${atual} ${resto}`;
      } else {
        linhas.push(atual);
        atual = resto;
      }
    }

    linhas.push(atual);
  }

  return linhas.length === 0 ? [''] : linhas;
};

export const tamanhoDoTextoQuadro = (texto: string): Tamanho => {
  const linhas = quebrarTextoQuadro(texto);
  const maior = Math.max(...linhas.map((linha) => linha.length));

  return {
    largura: Math.max(LARGURA_MINIMA, maior * PX_POR_CARACTERE + PADDING),
    altura: Math.max(ALTURA_MINIMA, linhas.length * ALTURA_DA_LINHA + PADDING),
  };
};

// Camadas por caminho mais longo a partir das fontes; ligações de retorno (ciclos) são ignoradas.
const calcularCamadas = (quantidade: number, arestas: Array<[number, number]>): number[] => {
  const sucessores: number[][] = Array.from({ length: quantidade }, () => []);

  for (const [de, para] of arestas) {
    sucessores[de].push(para);
  }

  const estado = new Array<number>(quantidade).fill(0); // 0 novo, 1 na pilha, 2 pronto
  const dag: Array<[number, number]> = [];

  const visitar = (inicio: number): void => {
    const pilha: Array<{ no: number; proximo: number }> = [{ no: inicio, proximo: 0 }];

    estado[inicio] = 1;

    while (pilha.length > 0) {
      const topo = pilha[pilha.length - 1];

      if (topo.proximo >= sucessores[topo.no].length) {
        estado[topo.no] = 2;
        pilha.pop();
        continue;
      }

      const alvo = sucessores[topo.no][topo.proximo++];

      if (estado[alvo] === 1) {
        continue; // ligação de retorno
      }

      dag.push([topo.no, alvo]);

      if (estado[alvo] === 0) {
        estado[alvo] = 1;
        pilha.push({ no: alvo, proximo: 0 });
      }
    }
  };

  const grauEntrada = new Array<number>(quantidade).fill(0);

  for (const [, para] of arestas) {
    grauEntrada[para]++;
  }

  // Começa pelas fontes para a ordem de visita seguir o fluxo; depois o que sobrar (ciclos puros).
  for (let i = 0; i < quantidade; i++) {
    if (grauEntrada[i] === 0 && estado[i] === 0) {
      visitar(i);
    }
  }

  for (let i = 0; i < quantidade; i++) {
    if (estado[i] === 0) {
      visitar(i);
    }
  }

  // Caminho mais longo no DAG (Kahn).
  const camada = new Array<number>(quantidade).fill(0);
  const entradaDag = new Array<number>(quantidade).fill(0);
  const saidaDag: number[][] = Array.from({ length: quantidade }, () => []);

  for (const [de, para] of dag) {
    entradaDag[para]++;
    saidaDag[de].push(para);
  }

  const fila: number[] = [];

  entradaDag.forEach((grau, indice) => {
    if (grau === 0) {
      fila.push(indice);
    }
  });

  while (fila.length > 0) {
    const no = fila.shift() as number;

    for (const alvo of saidaDag[no]) {
      camada[alvo] = Math.max(camada[alvo], camada[no] + 1);
      entradaDag[alvo]--;

      if (entradaDag[alvo] === 0) {
        fila.push(alvo);
      }
    }
  }

  return camada;
};

// Reduz cruzamentos com algumas passadas de baricentro entre camadas vizinhas.
const ordenarCamadas = (camadas: number[][], arestas: Array<[number, number]>): number[][] => {
  const vizinhos = new Map<number, number[]>();

  for (const [de, para] of arestas) {
    vizinhos.set(de, [...(vizinhos.get(de) ?? []), para]);
    vizinhos.set(para, [...(vizinhos.get(para) ?? []), de]);
  }

  let ordem = camadas.map((camada) => [...camada]);

  const passada = (indices: number[], referencia: (i: number) => number): void => {
    for (const i of indices) {
      const posicao = new Map<number, number>();

      ordem[referencia(i)].forEach((no, p) => posicao.set(no, p));

      const chave = (no: number): number => {
        const ligados = (vizinhos.get(no) ?? []).filter((outro) => posicao.has(outro));

        if (ligados.length === 0) {
          return Number.NaN;
        }

        return ligados.reduce((soma, outro) => soma + (posicao.get(outro) as number), 0) / ligados.length;
      };

      const atual = ordem[i];
      const indiceOriginal = new Map(atual.map((no, p) => [no, p]));

      ordem[i] = [...atual].sort((a, b) => {
        const ka = chave(a);
        const kb = chave(b);
        const va = Number.isNaN(ka) ? (indiceOriginal.get(a) as number) : ka;
        const vb = Number.isNaN(kb) ? (indiceOriginal.get(b) as number) : kb;

        return va - vb || (indiceOriginal.get(a) as number) - (indiceOriginal.get(b) as number);
      });
    }
  };

  const indices = camadas.map((_, i) => i);

  for (let volta = 0; volta < 4; volta++) {
    passada(indices.slice(1), (i) => i - 1);
    passada(indices.slice(0, -1).reverse(), (i) => i + 1);
  }

  ordem = ordem.map((camada) => [...camada]);

  return ordem;
};

type OpcoesLayout = { origem?: PontoQuadro; zInicial?: number };

export const layoutDiagramaQuadro = (
  diagrama: DiagramaQuadro,
  { origem = [0, 0], zInicial = 0 }: OpcoesLayout = {},
): ResultadoLayoutDiagrama => {
  const { nos, ligacoes } = diagrama;
  const direcao = diagrama.direcao ?? 'direita';
  const indicePorId = new Map(nos.map((no, indice) => [no.id, indice]));
  const arestas: Array<[number, number]> = [];

  for (const ligacao of ligacoes) {
    const de = indicePorId.get(ligacao.de);
    const para = indicePorId.get(ligacao.para);

    if (de !== undefined && para !== undefined && de !== para) {
      arestas.push([de, para]);
    }
  }

  const tamanhos: Tamanho[] = nos.map((no) => tamanhoDoTextoQuadro(no.texto));
  const camadaDe = calcularCamadas(nos.length, arestas);
  const quantidadeDeCamadas = nos.length === 0 ? 0 : Math.max(...camadaDe) + 1;
  const camadas: number[][] = Array.from({ length: quantidadeDeCamadas }, () => []);

  camadaDe.forEach((camada, indice) => camadas[camada].push(indice));

  const ordem = ordenarCamadas(camadas, arestas);
  const horizontal = direcao === 'direita';

  // Eixo principal: sentido das camadas. Eixo cruzado: nós dentro da camada.
  const principal = (indice: number): number => (horizontal ? tamanhos[indice].largura : tamanhos[indice].altura);
  const cruzado = (indice: number): number => (horizontal ? tamanhos[indice].altura : tamanhos[indice].largura);

  const extensaoCruzada = ordem.map(
    (camada) => camada.reduce((soma, indice) => soma + cruzado(indice), 0) + FOLGA_NA_CAMADA * Math.max(0, camada.length - 1),
  );
  const maiorExtensao = Math.max(0, ...extensaoCruzada);

  const posicoes = new Array<{ x: number; y: number }>(nos.length);
  let cursorPrincipal = 0;

  ordem.forEach((camada, indiceCamada) => {
    const espessura = Math.max(...camada.map(principal));
    let cursorCruzado = (maiorExtensao - extensaoCruzada[indiceCamada]) / 2;

    for (const indice of camada) {
      const deslocPrincipal = cursorPrincipal + (espessura - principal(indice)) / 2;
      const x = horizontal ? deslocPrincipal : cursorCruzado;
      const y = horizontal ? cursorCruzado : deslocPrincipal;

      posicoes[indice] = { x: origem[0] + x, y: origem[1] + y };
      cursorCruzado += cruzado(indice) + FOLGA_NA_CAMADA;
    }

    cursorPrincipal += espessura + FOLGA_ENTRE_CAMADAS;
  });

  const mapaIds: Record<string, string> = {};
  const formas: ElementoQuadro[] = nos.map((no, indice) => {
    const id = gerarIdQuadro();

    mapaIds[no.id] = id;

    return {
      id,
      tipo: no.forma ?? 'retangulo',
      x: Math.round(posicoes[indice].x),
      y: Math.round(posicoes[indice].y),
      largura: tamanhos[indice].largura,
      altura: tamanhos[indice].altura,
      cor: no.cor ?? COR_PADRAO_QUADRO,
      z: zInicial + indice,
      texto: no.texto,
    };
  });

  const caixasPorId = new Map(formas.map((forma) => [forma.id, forma]));
  const setas: ElementoQuadro[] = ligacoes.flatMap((ligacao, indice): ElementoQuadro[] => {
    const deId = mapaIds[ligacao.de];
    const paraId = mapaIds[ligacao.para];
    const origemForma = caixasPorId.get(deId);
    const destinoForma = caixasPorId.get(paraId);

    if (!origemForma || !destinoForma || deId === paraId) {
      return [];
    }

    const pontos: PontoQuadro[] = [centroDaCaixa(origemForma), centroDaCaixa(destinoForma)];

    return [
      {
        id: gerarIdQuadro(),
        tipo: 'seta',
        x: 0,
        y: 0,
        largura: 0,
        altura: 0,
        cor: 'gray',
        z: zInicial + formas.length + indice,
        pontos,
        deId,
        paraId,
        ...(ligacao.texto ? { texto: ligacao.texto } : {}),
      },
    ];
  });

  const elementos = atualizarSetasLigadas([...formas, ...setas]);
  const caixa: CaixaQuadro = caixaDosElementos(elementos) ?? { x: origem[0], y: origem[1], largura: 0, altura: 0 };

  return { elementos, mapaIds, caixa };
};

import { type ConteudoQuadro } from 'src/modules/quadros/types/conteudo-quadro';
import { type ResumoElementoQuadro, type ResumoQuadro } from 'src/modules/quadros/types/resumo-quadro';
import { type TipoElementoQuadro } from 'src/modules/quadros/types/tipo-elemento-quadro';
import { caixaDosElementos } from 'src/modules/quadros/utils/caixa-dos-elementos.util';

const arredondar = (valor: number): number => Math.round(valor);

export const resumirQuadro = (conteudo: ConteudoQuadro): ResumoQuadro => {
  const porId = new Map(conteudo.elementos.map((elemento) => [elemento.id, elemento]));
  const porTipo: Partial<Record<TipoElementoQuadro, number>> = {};
  const nome = (id: string): { id: string; texto: string } => {
    const alvo = porId.get(id);

    return { id, texto: alvo && 'texto' in alvo && alvo.texto ? alvo.texto : '' };
  };
  const rotulo = (referencia: { id: string; texto: string } | undefined): string =>
    referencia ? (referencia.texto !== '' ? referencia.texto : `(sem texto, id ${referencia.id})`) : '(solta)';
  const ligacoes: string[] = [];

  const elementos = conteudo.elementos.map((elemento): ResumoElementoQuadro => {
    porTipo[elemento.tipo] = (porTipo[elemento.tipo] ?? 0) + 1;

    const resumo: ResumoElementoQuadro = {
      id: elemento.id,
      tipo: elemento.tipo,
      cor: elemento.cor,
      x: arredondar(elemento.x),
      y: arredondar(elemento.y),
      largura: arredondar(elemento.largura),
      altura: arredondar(elemento.altura),
      ...('texto' in elemento && elemento.texto ? { texto: elemento.texto } : {}),
    };

    if (elemento.tipo === 'seta') {
      const de = elemento.deId !== undefined ? nome(elemento.deId) : undefined;
      const para = elemento.paraId !== undefined ? nome(elemento.paraId) : undefined;

      ligacoes.push(
        `${rotulo(de)} → ${rotulo(para)}${elemento.texto ? ` (${elemento.texto})` : ''}`,
      );

      return { ...resumo, ...(de ? { de } : {}), ...(para ? { para } : {}) };
    }

    return resumo;
  });

  const caixa = caixaDosElementos(conteudo.elementos);
  const caixaArredondada = caixa
    ? {
        x: arredondar(caixa.x),
        y: arredondar(caixa.y),
        largura: arredondar(caixa.largura),
        altura: arredondar(caixa.altura),
      }
    : null;
  const contagem = Object.entries(porTipo)
    .map(([tipo, quantidade]) => `${quantidade} ${tipo}`)
    .join(', ');
  const linhas: string[] = [
    conteudo.elementos.length === 0
      ? 'Quadro vazio.'
      : `Quadro com ${conteudo.elementos.length} elementos (${contagem}).`,
  ];

  if (caixaArredondada) {
    linhas.push(
      `Área ocupada: x ${caixaArredondada.x}, y ${caixaArredondada.y}, ${caixaArredondada.largura} x ${caixaArredondada.altura}.`,
    );
  }

  const formas = elementos.filter((elemento) => elemento.tipo !== 'seta');

  if (formas.length > 0) {
    linhas.push('Elementos:');

    for (const elemento of formas) {
      linhas.push(
        `- [${elemento.id}] ${elemento.tipo}${elemento.texto ? ` "${elemento.texto}"` : ''} cor ${elemento.cor} em (${elemento.x}, ${elemento.y}) ${elemento.largura}x${elemento.altura}`,
      );
    }
  }

  if (ligacoes.length > 0) {
    linhas.push('Ligações:');
    ligacoes.forEach((ligacao) => linhas.push(`- ${ligacao}`));
  }

  return {
    total: conteudo.elementos.length,
    porTipo,
    caixa: caixaArredondada,
    elementos,
    ligacoes,
    texto: linhas.join('\n'),
  };
};

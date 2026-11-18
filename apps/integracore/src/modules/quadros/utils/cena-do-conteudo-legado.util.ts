import { type CenaQuadro } from 'src/modules/quadros/types/cena-quadro';
import { type ConteudoQuadro } from 'src/modules/quadros/types/conteudo-quadro';
import { type OpcoesCenaQuadro } from 'src/modules/quadros/types/opcoes-cena-quadro';
import { converterParaExcalidraw } from 'src/modules/quadros/utils/converter-para-excalidraw.util';

// Quadro de antes do Excalidraw: o campo `conteudo` vira cena (o `conteudo` em si fica como estava).
export const cenaDoConteudoLegado = (conteudo: ConteudoQuadro, opcoes: OpcoesCenaQuadro): CenaQuadro => ({
  tipo: 'excalidraw',
  versao: 1,
  elements: converterParaExcalidraw(conteudo.elementos, [], opcoes).criados,
  appState: {},
  files: {},
});

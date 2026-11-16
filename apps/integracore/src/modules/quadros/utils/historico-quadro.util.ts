import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';
import { type HistoricoQuadro } from 'src/modules/quadros/types/historico-quadro';

export const LIMITE_HISTORICO = 100;

export const criarHistorico = (elementos: ElementoQuadro[]): HistoricoQuadro => ({
  passado: [],
  presente: elementos,
  futuro: [],
});

// Nova versão: guarda a atual no passado e descarta o que dava para refazer.
export const registrarNoHistorico = (
  historico: HistoricoQuadro,
  elementos: ElementoQuadro[],
): HistoricoQuadro => {
  if (elementos === historico.presente) {
    return historico;
  }

  return {
    passado: [...historico.passado, historico.presente].slice(-LIMITE_HISTORICO),
    presente: elementos,
    futuro: [],
  };
};

export const desfazer = (historico: HistoricoQuadro): HistoricoQuadro => {
  if (historico.passado.length === 0) {
    return historico;
  }

  return {
    passado: historico.passado.slice(0, -1),
    presente: historico.passado[historico.passado.length - 1],
    futuro: [historico.presente, ...historico.futuro],
  };
};

export const refazer = (historico: HistoricoQuadro): HistoricoQuadro => {
  if (historico.futuro.length === 0) {
    return historico;
  }

  return {
    passado: [...historico.passado, historico.presente],
    presente: historico.futuro[0],
    futuro: historico.futuro.slice(1),
  };
};

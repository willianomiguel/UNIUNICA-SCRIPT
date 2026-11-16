import { type PontoBurndown } from 'src/modules/sprints/types/ponto-burndown';
import { normalizarHistoricoBurndown } from 'src/modules/sprints/utils/normalizar-historico-burndown.util';

// Adiciona (ou substitui, se já houver foto no dia) a foto do dia no histórico.
export const registrarPontoBurndown = (
  historico: unknown,
  ponto: PontoBurndown,
): PontoBurndown[] => {
  const atual = normalizarHistoricoBurndown(historico).filter(
    (item) => item.data !== ponto.data,
  );

  return [...atual, ponto].sort((a, b) => a.data.localeCompare(b.data));
};

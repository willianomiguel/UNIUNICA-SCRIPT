import { type StatusMeta } from 'src/modules/metas/types/status-meta';
import { calcularTempoDecorrido } from 'src/modules/metas/utils/calcular-tempo-decorrido.util';

// Tolerância (pontos percentuais) abaixo do esperado ainda considerada "no prazo".
const TOLERANCIA_NO_PRAZO = 10;

// Status comparando o progresso com o tempo decorrido do período:
// concluída ≥ 100%; prazo vencido sem concluir → atrasada; até 10 p.p. abaixo do
// esperado → no prazo; até metade do esperado → em risco; abaixo disso → atrasada.
export const calcularStatusMeta = (
  progresso: number,
  dataInicio: string | null,
  dataFim: string | null,
  hoje: string,
): StatusMeta => {
  if (progresso >= 100) {
    return 'CONCLUIDA';
  }

  if (dataFim && hoje > dataFim.slice(0, 10)) {
    return 'ATRASADA';
  }

  const esperado = calcularTempoDecorrido(dataInicio, dataFim, hoje);

  if (esperado === null || progresso >= esperado - TOLERANCIA_NO_PRAZO) {
    return 'NO_PRAZO';
  }

  return progresso >= esperado / 2 ? 'EM_RISCO' : 'ATRASADA';
};

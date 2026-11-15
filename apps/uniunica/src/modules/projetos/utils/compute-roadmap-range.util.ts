import { type ProjetoRecord } from 'src/modules/projetos/types/projeto-record';
import { type RoadmapRange } from 'src/modules/projetos/types/roadmap-range';
import { getQuarterStart } from 'src/modules/projetos/utils/get-quarter-start.util';
import { parseDateOnly } from 'src/modules/projetos/utils/parse-date-only.util';

const MAX_QUARTERS = 8;

// Intervalo do Roadmap: no mínimo o trimestre atual e o próximo, ampliado (em trimestres
// inteiros) para cobrir as datas dos projetos, limitado a 8 trimestres a partir do início.
export const computeRoadmapRange = (
  projetos: ProjetoRecord[],
  todayMs: number,
): RoadmapRange => {
  let minMs = todayMs;
  let maxMs = getQuarterStart(todayMs, 2) - 1;

  for (const projeto of projetos) {
    for (const value of [projeto.dataInicio, projeto.dataFim]) {
      const ms = parseDateOnly(value);

      if (ms === null) {
        continue;
      }

      minMs = Math.min(minMs, ms);
      maxMs = Math.max(maxMs, ms);
    }
  }

  const startMs = getQuarterStart(minMs);
  const endMs = Math.min(getQuarterStart(maxMs, 1), getQuarterStart(startMs, MAX_QUARTERS));

  return { startMs, endMs };
};

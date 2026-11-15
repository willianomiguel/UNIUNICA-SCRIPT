import { AREA_LABELS } from 'src/modules/projetos/constants/area-labels';
import { AREA_VALUES } from 'src/modules/projetos/constants/area-values';
import { type ProjetoRecord } from 'src/modules/projetos/types/projeto-record';
import { type RoadmapAreaGroup } from 'src/modules/projetos/types/roadmap-area-group';
import { parseDateOnly } from 'src/modules/projetos/utils/parse-date-only.util';

const SEM_AREA = 'SEM_AREA';

const startOf = (projeto: ProjetoRecord): number =>
  parseDateOnly(projeto.dataInicio) ?? parseDateOnly(projeto.dataFim) ?? Number.MAX_SAFE_INTEGER;

// Agrupa projetos por área na ordem fixa das áreas ("Sem área" por último),
// omitindo grupos vazios e ordenando cada grupo pela data de início.
export const groupProjetosByArea = (projetos: ProjetoRecord[]): RoadmapAreaGroup[] => {
  const order = [...AREA_VALUES, SEM_AREA] as string[];
  const byArea = new Map<string, ProjetoRecord[]>();

  for (const projeto of projetos) {
    const area = projeto.area && order.includes(projeto.area) ? projeto.area : SEM_AREA;
    byArea.set(area, [...(byArea.get(area) ?? []), projeto]);
  }

  return order
    .filter((area) => (byArea.get(area) ?? []).length > 0)
    .map((area) => ({
      area,
      label: AREA_LABELS[area] ?? 'Sem área',
      projetos: [...(byArea.get(area) ?? [])].sort(
        (a, b) => startOf(a) - startOf(b) || (a.nome ?? '').localeCompare(b.nome ?? ''),
      ),
    }));
};

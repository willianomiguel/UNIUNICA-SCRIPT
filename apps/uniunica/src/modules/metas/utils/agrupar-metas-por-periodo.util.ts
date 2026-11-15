import { type MetaResumo } from 'src/modules/metas/types/meta-resumo';

// Agrupa metas principais (sem meta pai) por período, períodos mais recentes primeiro.
export const agruparMetasPorPeriodo = (
  metas: MetaResumo[],
): Array<{ periodo: string; metas: MetaResumo[] }> => {
  const ids = new Set(metas.map((meta) => meta.id));
  const grupos = new Map<string, MetaResumo[]>();

  for (const meta of metas) {
    if (meta.metaPaiId && ids.has(meta.metaPaiId)) continue;

    const periodo = meta.periodo ?? 'Sem período';

    grupos.set(periodo, [...(grupos.get(periodo) ?? []), meta]);
  }

  return [...grupos.entries()]
    .sort(([a], [b]) =>
      a === 'Sem período' ? 1 : b === 'Sem período' ? -1 : b.localeCompare(a),
    )
    .map(([periodo, metasDoPeriodo]) => ({
      periodo,
      metas: [...metasDoPeriodo].sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR')),
    }));
};

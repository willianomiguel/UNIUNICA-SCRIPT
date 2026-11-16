import { type Trimestre } from 'src/modules/metas/types/trimestre';

// Trimestre civil que contém a data (YYYY-MM-DD): "2026-T4", 2026-10-01 a 2026-12-31.
export const calcularTrimestre = (data: string): Trimestre => {
  const ano = Number(data.slice(0, 4));
  const trimestre = Math.floor((Number(data.slice(5, 7)) - 1) / 3) + 1;
  const mesInicio = (trimestre - 1) * 3 + 1;
  const ultimoDia = new Date(Date.UTC(ano, mesInicio + 2, 0)).getUTCDate();

  return {
    periodo: `${ano}-T${trimestre}`,
    dataInicio: `${ano}-${String(mesInicio).padStart(2, '0')}-01`,
    dataFim: `${ano}-${String(mesInicio + 2).padStart(2, '0')}-${ultimoDia}`,
  };
};

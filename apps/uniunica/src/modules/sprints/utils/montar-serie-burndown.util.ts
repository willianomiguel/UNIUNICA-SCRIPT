import { type PontoGraficoBurndown } from 'src/modules/sprints/types/ponto-grafico-burndown';
import { listarDiasEntreDatas } from 'src/modules/sprints/utils/listar-dias-entre-datas.util';
import { normalizarHistoricoBurndown } from 'src/modules/sprints/utils/normalizar-historico-burndown.util';

const arredondar = (valor: number) => Math.round(valor * 100) / 100;

// Monta a série do gráfico: para cada dia da sprint, a linha ideal (de
// pontosTotais até 0 em linha reta) e a linha real (foto do dia, se houver).
// Dias sem foto até "hoje" repetem a última foto conhecida; dias futuros
// ficam sem valor real.
export const montarSerieBurndown = ({
  dataInicio,
  dataFim,
  pontosTotais,
  historico,
  hoje,
}: {
  dataInicio: string | null | undefined;
  dataFim: string | null | undefined;
  pontosTotais: number;
  historico: unknown;
  hoje: string;
}): PontoGraficoBurndown[] => {
  const dias = listarDiasEntreDatas(dataInicio, dataFim);

  if (dias.length === 0) {
    return [];
  }

  const fotos = new Map(
    normalizarHistoricoBurndown(historico).map((foto) => [
      foto.data,
      foto.pontosRestantes,
    ]),
  );
  const intervalos = Math.max(dias.length - 1, 1);
  let ultimoReal: number | null = null;

  return dias.map((data, indice) => {
    const ideal = arredondar(
      dias.length === 1 ? 0 : pontosTotais * (1 - indice / intervalos),
    );
    const foto = fotos.get(data);

    if (foto !== undefined) {
      ultimoReal = foto;
    }

    const real =
      foto !== undefined ? foto : data <= hoje ? ultimoReal : null;

    return { data, ideal, real };
  });
};

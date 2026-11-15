import { calcularPontuacaoIdeia } from 'src/modules/projetos/utils/calcular-pontuacao-ideia.util';

type IdeiaLike = {
  id?: string | null;
  impacto?: number | null;
  esforco?: number | null;
  votos?: number | null;
  pontuacao?: number | null;
};

type IdeiaEvent = {
  recordId?: string;
  properties?: { after?: IdeiaLike | null };
};

// Ideias (do estado `after` dos eventos) cuja pontuação gravada difere da calculada.
// Comparar antes de gravar evita laços infinitos de atualização.
export const extractIdeiasParaPontuar = (
  events: IdeiaEvent[],
): Array<{ id: string; pontuacao: number }> => {
  const updates = new Map<string, number>();

  for (const event of events) {
    const after = event.properties?.after;
    const id = after?.id ?? event.recordId;

    if (!after || typeof id !== 'string' || id.length === 0) {
      continue;
    }

    const pontuacao = calcularPontuacaoIdeia(after);

    if (after.pontuacao !== pontuacao) {
      updates.set(id, pontuacao);
    }
  }

  return [...updates].map(([id, pontuacao]) => ({ id, pontuacao }));
};

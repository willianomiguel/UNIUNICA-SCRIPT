import { arredondarReais } from 'src/modules/assistente/utils/arredondar-reais.util';
import { type MetaResumo } from 'src/modules/metas/types/meta-resumo';
import { calcularDiasRestantes } from 'src/modules/metas/utils/calcular-dias-restantes.util';

// Quanto falta para bater a meta e quanto isso dá por dia (contando hoje e o dia final).
// Funciona para metas de redução (alvo menor que o inicial). Sem alvo ou com prazo vencido,
// o "por dia" é null; meta batida falta 0.
export const calcularFaltaMeta = (
  meta: Pick<MetaResumo, 'valorInicial' | 'valorAlvo' | 'valorAtual' | 'dataFim'>,
  hoje: string,
): { faltaTotal: number | null; faltaPorDia: number | null; diasRestantes: number | null } => {
  const diasRestantes = calcularDiasRestantes(meta.dataFim, hoje);

  if (meta.valorAlvo === null) {
    return { faltaTotal: null, faltaPorDia: null, diasRestantes };
  }

  const atual = meta.valorAtual ?? meta.valorInicial;
  const bruta = meta.valorAlvo >= meta.valorInicial ? meta.valorAlvo - atual : atual - meta.valorAlvo;
  const faltaTotal = Math.max(0, arredondarReais(bruta));

  if (faltaTotal === 0) {
    return { faltaTotal, faltaPorDia: 0, diasRestantes };
  }

  if (diasRestantes === null || diasRestantes < 0) {
    return { faltaTotal, faltaPorDia: null, diasRestantes };
  }

  return { faltaTotal, faltaPorDia: arredondarReais(faltaTotal / (diasRestantes + 1)), diasRestantes };
};

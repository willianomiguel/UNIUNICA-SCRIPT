import { type MetaInsightLinha } from 'src/modules/trafego/types/meta-insight-linha';
import { paraNumero } from 'src/modules/trafego/utils/para-numero.util';

// Valor do primeiro tipo de ação presente (em ordem de preferência), para não somar duplicados.
export const extrairAcaoMeta = (
  acoes: MetaInsightLinha['actions'],
  tiposPreferidos: string[],
): number => {
  if (!Array.isArray(acoes)) {
    return 0;
  }

  for (const tipo of tiposPreferidos) {
    const acao = acoes.find((item) => item?.action_type === tipo);

    if (acao) {
      return Math.round(paraNumero(acao.value));
    }
  }

  return 0;
};

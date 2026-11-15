import { type CategoriaResumo } from 'src/modules/financeiro/types/categoria-resumo';
import { type RegistroTwenty } from 'src/modules/financeiro/types/registro-twenty';
import { microsParaReais } from 'src/modules/financeiro/utils/micros-para-reais.util';

export const normalizarCategoria = (registro: RegistroTwenty): CategoriaResumo => {
  const orcamento = registro.orcamentoMensal as
    | { amountMicros?: unknown }
    | null
    | undefined;

  return {
    id: registro.id,
    nome:
      typeof registro.nome === 'string' && registro.nome.length > 0
        ? registro.nome
        : 'Sem nome',
    tipo: registro.tipo === 'ENTRADA' ? 'ENTRADA' : 'SAIDA',
    orcamentoMensal: microsParaReais(orcamento?.amountMicros),
  };
};

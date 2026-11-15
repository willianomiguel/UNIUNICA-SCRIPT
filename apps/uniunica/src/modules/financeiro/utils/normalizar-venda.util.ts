import { type RegistroTwenty } from 'src/modules/financeiro/types/registro-twenty';
import { type VendaResumo } from 'src/modules/financeiro/types/venda-resumo';
import { microsParaReais } from 'src/modules/financeiro/utils/micros-para-reais.util';

const moeda = (valor: unknown): number | null => {
  const amountMicros = (valor as { amountMicros?: unknown } | null | undefined)
    ?.amountMicros;

  if (amountMicros === null || amountMicros === undefined || amountMicros === '') {
    return null;
  }

  return microsParaReais(amountMicros);
};

const texto = (valor: unknown): string | null =>
  typeof valor === 'string' && valor.length > 0 ? valor : null;

// Converte uma venda crua (API REST ou evento do banco) em VendaResumo.
export const normalizarVenda = (registro: RegistroTwenty): VendaResumo => ({
  id: registro.id,
  status: texto(registro.status),
  descricao: texto(registro.descricao),
  valor: moeda(registro.valor),
  valorLiquido: moeda(registro.valorLiquido),
  dataEvento: texto(registro.dataEvento),
});

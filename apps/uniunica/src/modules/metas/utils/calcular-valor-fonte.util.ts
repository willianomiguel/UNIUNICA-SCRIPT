import { type RegistroTwenty } from 'src/modules/financeiro/types/registro-twenty';
import { microsParaReais } from 'src/modules/financeiro/utils/micros-para-reais.util';
import { type DadosFontes } from 'src/modules/metas/types/dados-fontes';
import { type FonteMeta } from 'src/modules/metas/types/fonte-meta';
import { estaNoPeriodo } from 'src/modules/metas/utils/esta-no-periodo.util';

const arredondar = (valor: number): number => Math.round(valor * 100) / 100;

const moeda = (valor: unknown): number | null => {
  const amountMicros = (valor as { amountMicros?: unknown } | null | undefined)
    ?.amountMicros;

  return amountMicros === null || amountMicros === undefined || amountMicros === ''
    ? null
    : microsParaReais(amountMicros);
};

const somar = (registros: RegistroTwenty[], valor: (registro: RegistroTwenty) => number) =>
  arredondar(registros.reduce((total, registro) => total + valor(registro), 0));

// Valor atual de uma meta automática no período. null = fonte manual ou indisponível.
export const calcularValorFonte = (
  fonte: FonteMeta,
  dados: DadosFontes,
  dataInicio: string | null,
  dataFim: string | null,
): number | null => {
  const noPeriodo = (campo: string) => (registro: RegistroTwenty) =>
    estaNoPeriodo(registro[campo], dataInicio, dataFim);

  switch (fonte) {
    case 'FATURAMENTO_BRUTO':
    case 'FATURAMENTO_LIQUIDO':
    case 'VENDAS_APROVADAS': {
      if (dados.vendas === null) return null;

      const aprovadas = dados.vendas.filter(
        (venda) => venda.status === 'APROVADA' && noPeriodo('dataEvento')(venda),
      );

      if (fonte === 'VENDAS_APROVADAS') return aprovadas.length;

      return somar(aprovadas, (venda) =>
        fonte === 'FATURAMENTO_LIQUIDO'
          ? (moeda(venda.valorLiquido) ?? moeda(venda.valor) ?? 0)
          : (moeda(venda.valor) ?? 0),
      );
    }
    case 'TAXA_CHARGEBACK': {
      if (dados.vendas === null) return null;

      const vendas = dados.vendas.filter(noPeriodo('dataEvento'));
      const chargebacks = vendas.filter((venda) => venda.status === 'CHARGEBACK').length;
      const concluidas = vendas.filter((venda) =>
        ['APROVADA', 'REEMBOLSADA', 'CHARGEBACK'].includes(String(venda.status)),
      ).length;

      return concluidas === 0 ? 0 : arredondar((chargebacks / concluidas) * 100);
    }
    case 'LUCRO': {
      if (dados.lancamentos === null) return null;

      return somar(
        dados.lancamentos.filter(
          (lancamento) => lancamento.status === 'PAGO' && noPeriodo('data')(lancamento),
        ),
        (lancamento) =>
          (lancamento.tipo === 'ENTRADA' ? 1 : -1) *
          Math.abs(moeda(lancamento.valor) ?? 0),
      );
    }
    case 'LEADS':
    case 'CLIQUES': {
      if (dados.metricasTrafego === null) return null;

      const campo = fonte === 'LEADS' ? 'leads' : 'cliques';

      return somar(dados.metricasTrafego.filter(noPeriodo('data')), (metrica) => {
        const valor = Number(metrica[campo]);

        return Number.isFinite(valor) ? valor : 0;
      });
    }
    default:
      return null;
  }
};

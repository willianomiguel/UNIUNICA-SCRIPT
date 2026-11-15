import { describe, expect, it } from 'vitest';

import { montarProximaOcorrencia } from 'src/modules/financeiro/utils/montar-proxima-ocorrencia.util';

const base = {
  id: 'raiz',
  descricao: 'Folha',
  tipo: 'SAIDA',
  valor: { amountMicros: 9_500_000_000, currencyCode: 'BRL' },
  data: '2026-01-31',
  vencimento: '2026-02-05',
  status: 'PAGO',
  recorrencia: 'MENSAL',
  formaPagamento: 'PIX',
  centroCusto: 'ADMINISTRATIVO',
  observacoes: null,
  categoriaId: 'cat',
};

describe('montarProximaOcorrencia', () => {
  it('copia os dados, mantém a distância do vencimento e cria a chave', () => {
    expect(montarProximaOcorrencia(base)).toEqual({
      descricao: 'Folha',
      tipo: 'SAIDA',
      valor: { amountMicros: 9_500_000_000, currencyCode: 'BRL' },
      data: '2026-02-28',
      vencimento: '2026-03-05',
      status: 'PENDENTE',
      recorrencia: 'MENSAL',
      origem: 'RECORRENCIA',
      chaveIdempotencia: 'recorrencia:raiz:2026-02-28',
      formaPagamento: 'PIX',
      centroCusto: 'ADMINISTRATIVO',
      observacoes: null,
      categoriaId: 'cat',
      recorrenciaRaizId: 'raiz',
    });
  });

  it('usa a raiz da série e o dia âncora', () => {
    const proxima = montarProximaOcorrencia(
      { ...base, id: 'filho', recorrenciaRaizId: 'raiz', data: '2026-02-28', vencimento: null },
      '2026-01-31',
    );

    expect(proxima?.data).toBe('2026-03-31');
    expect(proxima?.vencimento).toBeNull();
    expect(proxima?.chaveIdempotencia).toBe('recorrencia:raiz:2026-03-31');
  });

  it('usa o vencimento quando não há data', () => {
    const proxima = montarProximaOcorrencia({ ...base, data: null, vencimento: '2026-05-10' });

    expect(proxima?.data).toBeNull();
    expect(proxima?.vencimento).toBe('2026-06-10');
  });

  it('não gera sem recorrência ou sem datas', () => {
    expect(montarProximaOcorrencia({ ...base, recorrencia: 'NENHUMA' })).toBeNull();
    expect(montarProximaOcorrencia({ ...base, data: null, vencimento: null })).toBeNull();
  });
});

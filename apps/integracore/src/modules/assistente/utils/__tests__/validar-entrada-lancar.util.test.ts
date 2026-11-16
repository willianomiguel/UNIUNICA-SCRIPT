import { describe, expect, it } from 'vitest';

import { montarPayloadLancamento } from 'src/modules/assistente/utils/montar-payload-lancamento.util';
import { reaisParaCentavos } from 'src/modules/assistente/utils/reais-para-centavos.util';
import { validarEntradaLancar } from 'src/modules/assistente/utils/validar-entrada-lancar.util';

const HOJE = '2026-11-15';
const base = { descricao: 'Notion', valor: 89.9, tipo: 'SAIDA' };

describe('validarEntradaLancar', () => {
  it('aceita entrada mínima e aplica os padrões (data de hoje, status pago)', () => {
    expect(validarEntradaLancar(base, HOJE)).toEqual({
      ok: true,
      valor: {
        descricao: 'Notion',
        valorCentavos: 8990,
        tipo: 'SAIDA',
        categoria: null,
        data: HOJE,
        vencimento: null,
        status: 'PAGO',
        formaPagamento: null,
        observacoes: null,
      },
    });
  });

  it('recusa data ou vencimento a 3 anos de hoje', () => {
    expect(validarEntradaLancar({ ...base, data: '2029-11-15' }, HOJE)).toMatchObject({ ok: false });
    expect(validarEntradaLancar({ ...base, vencimento: '2023-11-14' }, HOJE)).toMatchObject({ ok: false });
    expect(validarEntradaLancar({ ...base, data: '2027-11-15' }, HOJE)).toMatchObject({ ok: true });
  });

  it('recusa valor com mais de 2 casas e aceita 10.5', () => {
    expect(validarEntradaLancar({ ...base, valor: 10.005 }, HOJE)).toMatchObject({ ok: false });
    expect(validarEntradaLancar({ ...base, valor: 10.5 }, HOJE)).toMatchObject({ ok: true, valor: { valorCentavos: 1050 } });
  });

  it('usa pendente quando a data é futura', () => {
    const resultado = validarEntradaLancar({ ...base, data: '2026-12-01' }, HOJE);

    expect(resultado).toMatchObject({ ok: true, valor: { status: 'PENDENTE' } });
  });

  it('aceita apelidos de tipo e forma de pagamento', () => {
    const resultado = validarEntradaLancar({ ...base, tipo: 'Receita', formaPagamento: 'Cartão de crédito' }, HOJE);

    expect(resultado).toMatchObject({ ok: true, valor: { tipo: 'ENTRADA', formaPagamento: 'CARTAO' } });
  });

  it.each([0, -5, Number.NaN, Number.POSITIVE_INFINITY, 'abc', null, undefined, {}, 0.004])(
    'recusa valor %s',
    (valor) => {
      expect(validarEntradaLancar({ ...base, valor }, HOJE)).toMatchObject({ ok: false });
    },
  );

  it('aceita valor em texto no formato brasileiro', () => {
    expect(validarEntradaLancar({ ...base, valor: '1.234,56' }, HOJE)).toMatchObject({
      ok: true,
      valor: { valorCentavos: 123456 },
    });
  });

  it.each(['2026-02-30', '15/11/2026', 'hoje', 20261115])('recusa data inválida %s', (data) => {
    expect(validarEntradaLancar({ ...base, data }, HOJE)).toMatchObject({ ok: false });
    expect(validarEntradaLancar({ ...base, vencimento: data }, HOJE)).toMatchObject({ ok: false });
  });

  it('recusa descrição vazia, tipo, status e forma inválidos', () => {
    expect(validarEntradaLancar({ ...base, descricao: '  ' }, HOJE)).toMatchObject({ ok: false });
    expect(validarEntradaLancar({ ...base, tipo: 'talvez' }, HOJE)).toMatchObject({ ok: false });
    expect(validarEntradaLancar({ ...base, status: 'FEITO' }, HOJE)).toMatchObject({ ok: false });
    expect(validarEntradaLancar({ ...base, formaPagamento: 'cheque' }, HOJE)).toMatchObject({ ok: false });
    expect(validarEntradaLancar(null, HOJE)).toMatchObject({ ok: false });
  });

  it('arredonda centavos sem erro de ponto flutuante (0.1 + 0.2)', () => {
    expect(reaisParaCentavos(0.1 + 0.2)).toBe(30);
    expect(reaisParaCentavos(1.005)).toBe(101);
    expect(validarEntradaLancar({ ...base, valor: 0.1 + 0.2 }, HOJE)).toMatchObject({
      ok: true,
      valor: { valorCentavos: 30 },
    });
  });
});

describe('montarPayloadLancamento', () => {
  it('converte centavos em micros, marca origem manual e a observação do assistente', () => {
    const entrada = validarEntradaLancar({ ...base, valor: 0.1 + 0.2, observacoes: 'teste' }, HOJE);

    if (!entrada.ok) {
      throw new Error(entrada.erro);
    }

    expect(montarPayloadLancamento(entrada.valor, 'cat-1')).toMatchObject({
      valor: { amountMicros: 300_000, currencyCode: 'BRL' },
      origem: 'MANUAL',
      vencimento: HOJE,
      categoriaId: 'cat-1',
      observacoes: 'teste Lançado pelo assistente de IA.',
    });
  });
});

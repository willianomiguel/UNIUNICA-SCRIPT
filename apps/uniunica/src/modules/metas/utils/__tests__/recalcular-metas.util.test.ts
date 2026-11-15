import { describe, expect, it } from 'vitest';

import { recalcularMetas } from 'src/modules/metas/utils/recalcular-metas.util';
import { type MetaResumo } from 'src/modules/metas/types/meta-resumo';

const meta = (dados: Partial<MetaResumo>): MetaResumo => ({
  id: 'm',
  titulo: 'Meta',
  fonte: 'MANUAL',
  unidade: 'QUANTIDADE',
  periodo: null,
  dataInicio: '2026-10-01',
  dataFim: '2026-12-31',
  valorInicial: 0,
  valorAlvo: 100,
  valorAtual: 0,
  progresso: null,
  status: null,
  metaPaiId: null,
  ...dados,
});

const semFontes = { vendas: null, lancamentos: null, metricasTrafego: null };
const hoje = '2026-11-15'; // ~50% do 4º trimestre

describe('recalcularMetas', () => {
  it('calcula valor de fonte automática, progresso e status', () => {
    const atualizacoes = recalcularMetas(
      [meta({ id: 'fat', fonte: 'FATURAMENTO_BRUTO', valorAlvo: 1000, valorAtual: 0 })],
      {
        ...semFontes,
        vendas: [
          { id: 'v', status: 'APROVADA', valor: { amountMicros: 600_000_000 }, dataEvento: '2026-11-01' },
        ],
      },
      hoje,
    );

    expect(atualizacoes).toEqual([
      { id: 'fat', valorAtual: 600, progresso: 60, status: 'NO_PRAZO' },
    ]);
  });

  it('mantém o valor manual e não muda valor de fonte indisponível', () => {
    expect(
      recalcularMetas(
        [
          meta({ id: 'manual', valorAtual: 10 }),
          meta({ id: 'leads', fonte: 'LEADS', valorAtual: 30 }),
        ],
        semFontes,
        hoje,
      ),
    ).toEqual([
      { id: 'manual', progresso: 10, status: 'ATRASADA' },
      { id: 'leads', progresso: 30, status: 'EM_RISCO' },
    ]);
  });

  it('meta pai usa a média das submetas em vários níveis', () => {
    const atualizacoes = recalcularMetas(
      [
        meta({ id: 'pai', valorAtual: 0 }),
        meta({ id: 'filha1', metaPaiId: 'pai', valorAtual: 100 }),
        meta({ id: 'filha2', metaPaiId: 'pai' }),
        meta({ id: 'neta1', metaPaiId: 'filha2', valorAtual: 40 }),
        meta({ id: 'neta2', metaPaiId: 'filha2', valorAtual: 60 }),
      ],
      semFontes,
      hoje,
    );
    const progresso = Object.fromEntries(atualizacoes.map((item) => [item.id, item.progresso]));

    expect(progresso).toEqual({ pai: 75, filha1: 100, filha2: 50, neta1: 40, neta2: 60 });
  });

  it('não entra em laço com ciclos e só devolve o que mudou', () => {
    const metas = [
      meta({ id: 'a', metaPaiId: 'b', valorAtual: 50, progresso: 50, status: 'NO_PRAZO' }),
      meta({ id: 'b', metaPaiId: 'a', valorAtual: 50 }),
    ];
    const primeira = recalcularMetas(metas, semFontes, hoje);

    expect(primeira.length).toBeGreaterThan(0);

    const aplicadas = metas.map((item) => ({
      ...item,
      ...primeira.find((atualizacao) => atualizacao.id === item.id),
    }));

    expect(recalcularMetas(aplicadas, semFontes, hoje)).toEqual([]);
  });
});

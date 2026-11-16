import { describe, expect, it } from 'vitest';

import { encontrarCategoria } from 'src/modules/assistente/utils/encontrar-categoria.util';
import { validarEntradaMetas } from 'src/modules/assistente/utils/validar-entrada-metas.util';
import { validarEntradaSprints } from 'src/modules/assistente/utils/validar-entrada-sprints.util';
import { validarEntradaTrafego } from 'src/modules/assistente/utils/validar-entrada-trafego.util';
import { validarPeriodo } from 'src/modules/assistente/utils/validar-periodo.util';

const HOJE = '2026-11-15';

describe('validarPeriodo', () => {
  it('sem entrada usa o mês atual (completo ou até hoje) ou os últimos N dias', () => {
    expect(validarPeriodo(undefined, HOJE, { tipo: 'MES_COMPLETO' })).toEqual({
      ok: true,
      valor: { inicio: '2026-11-01', fim: '2026-11-30' },
    });
    expect(validarPeriodo({}, HOJE, { tipo: 'MES_ATE_HOJE' })).toEqual({
      ok: true,
      valor: { inicio: '2026-11-01', fim: HOJE },
    });
    expect(validarPeriodo({}, HOJE, { tipo: 'ULTIMOS_DIAS', dias: 30 })).toEqual({
      ok: true,
      valor: { inicio: '2026-10-17', fim: HOJE },
    });
  });

  it('respeita início e fim informados e completa só o que falta', () => {
    expect(validarPeriodo({ inicio: '2026-10-01', fim: '2026-10-31' }, HOJE, { tipo: 'MES_ATE_HOJE' })).toEqual({
      ok: true,
      valor: { inicio: '2026-10-01', fim: '2026-10-31' },
    });
    expect(validarPeriodo({ inicio: '2026-11-05' }, HOJE, { tipo: 'MES_ATE_HOJE' })).toEqual({
      ok: true,
      valor: { inicio: '2026-11-05', fim: HOJE },
    });
    expect(validarPeriodo({ fim: '2026-10-20' }, HOJE, { tipo: 'MES_ATE_HOJE' })).toEqual({
      ok: true,
      valor: { inicio: '2026-10-01', fim: '2026-10-20' },
    });
  });

  it('recusa data inválida, fim antes do início e entrada que não é objeto', () => {
    expect(validarPeriodo({ inicio: '2026-02-30' }, HOJE, { tipo: 'MES_ATE_HOJE' })).toMatchObject({ ok: false });
    expect(validarPeriodo({ fim: 'ontem' }, HOJE, { tipo: 'MES_ATE_HOJE' })).toMatchObject({ ok: false });
    expect(validarPeriodo({ inicio: '2026-11-10', fim: '2026-11-01' }, HOJE, { tipo: 'MES_ATE_HOJE' })).toMatchObject({ ok: false });
    expect(validarPeriodo('x', HOJE, { tipo: 'MES_ATE_HOJE' })).toMatchObject({ ok: false });
  });
});

describe('validarPeriodo limites', () => {
  it('recusa anos fora de 2000-2100', () => {
    expect(validarPeriodo({ inicio: '1999-12-31', fim: '2000-01-05' }, HOJE, { tipo: 'MES_ATE_HOJE' })).toMatchObject({ ok: false });
    expect(validarPeriodo({ inicio: '2100-12-01', fim: '2101-01-05' }, HOJE, { tipo: 'MES_ATE_HOJE' })).toMatchObject({ ok: false });
  });

  it('recusa período de 4 anos e aceita 1 ano', () => {
    expect(validarPeriodo({ inicio: '2022-01-01', fim: '2026-01-01' }, HOJE, { tipo: 'MES_ATE_HOJE' })).toMatchObject({ ok: false });
    expect(validarPeriodo({ inicio: '2025-01-01', fim: '2025-12-31' }, HOJE, { tipo: 'MES_ATE_HOJE' })).toMatchObject({ ok: true });
  });
});

describe('validarEntradaTrafego / Metas / Sprints', () => {
  it('trafego usa 30 dias e aceita filtro de campanha', () => {
    expect(validarEntradaTrafego({ campanha: ' black ' }, HOJE)).toEqual({
      ok: true,
      valor: { intervalo: { inicio: '2026-10-17', fim: HOJE }, campanha: 'black' },
    });
    expect(validarEntradaTrafego({ campanha: 3 }, HOJE)).toMatchObject({ ok: false });
  });

  it('metas valida status', () => {
    expect(validarEntradaMetas(undefined)).toEqual({ ok: true, valor: { status: null, busca: null } });
    expect(validarEntradaMetas({ status: 'EM_RISCO', busca: 'fat' })).toMatchObject({ ok: true });
    expect(validarEntradaMetas({ status: 'XYZ' })).toMatchObject({ ok: false });
  });

  it('sprints valida o UUID', () => {
    expect(validarEntradaSprints({})).toEqual({ ok: true, valor: { sprintId: null } });
    expect(validarEntradaSprints({ sprintId: 'abc' })).toMatchObject({ ok: false });
    expect(validarEntradaSprints({ sprintId: '308dfee5-b793-47b3-b0cc-08fdeb96ee01' })).toMatchObject({ ok: true });
  });
});

describe('encontrarCategoria', () => {
  const categorias = [
    { id: '1', nome: 'Ferramentas/SaaS', tipo: 'SAIDA' as const, orcamentoMensal: 0 },
    { id: '2', nome: 'Tráfego pago', tipo: 'SAIDA' as const, orcamentoMensal: 0 },
  ];

  it('ignora caixa e acento, e recusa o que não existe', () => {
    expect(encontrarCategoria(categorias, 'trafego PAGO')?.id).toBe('2');
    expect(encontrarCategoria(categorias, 'ferramentas')?.id).toBe('1');
    expect(encontrarCategoria(categorias, 'Viagens')).toBeNull();
    expect(encontrarCategoria(categorias, '')).toBeNull();
  });
});

import { describe, expect, it } from 'vitest';

import { aplicarAtualizacoesMetas } from 'src/modules/assistente/utils/aplicar-atualizacoes-metas.util';
import { calcularFaltaMeta } from 'src/modules/assistente/utils/calcular-falta-meta.util';
import { escolherSprint } from 'src/modules/assistente/utils/escolher-sprint.util';
import { montarSituacaoMetas } from 'src/modules/assistente/utils/montar-situacao-metas.util';
import { montarSituacaoSprint } from 'src/modules/assistente/utils/montar-situacao-sprint.util';
import { type MetaResumo } from 'src/modules/metas/types/meta-resumo';

const HOJE = '2026-11-15';

const meta = (dados: Partial<MetaResumo>): MetaResumo => ({
  id: 'm1',
  titulo: 'Faturamento de novembro',
  fonte: 'MANUAL',
  unidade: 'REAIS',
  periodo: null,
  dataInicio: '2026-11-01',
  dataFim: '2026-11-30',
  valorInicial: 0,
  valorAlvo: 1600,
  valorAtual: 800,
  progresso: 50,
  status: 'NO_PRAZO',
  metaPaiId: null,
  ...dados,
});

describe('calcularFaltaMeta', () => {
  it('divide o que falta pelos dias restantes contando hoje', () => {
    expect(calcularFaltaMeta(meta({}), HOJE)).toEqual({ faltaTotal: 800, faltaPorDia: 50, diasRestantes: 15 });
  });

  it('meta batida falta zero; prazo vencido e sem alvo não têm por dia', () => {
    expect(calcularFaltaMeta(meta({ valorAtual: 2000 }), HOJE)).toMatchObject({ faltaTotal: 0, faltaPorDia: 0 });
    expect(calcularFaltaMeta(meta({ dataFim: '2026-11-01' }), HOJE)).toMatchObject({ faltaTotal: 800, faltaPorDia: null });
    expect(calcularFaltaMeta(meta({ valorAlvo: null }), HOJE)).toMatchObject({ faltaTotal: null, faltaPorDia: null });
  });

  it('funciona para metas de redução', () => {
    expect(
      calcularFaltaMeta(meta({ unidade: 'PERCENTUAL', valorInicial: 5, valorAlvo: 1, valorAtual: 3 }), HOJE),
    ).toMatchObject({ faltaTotal: 2 });
  });
});

describe('montarSituacaoMetas', () => {
  it('sem metas devolve lista vazia e mensagem', () => {
    expect(montarSituacaoMetas({ metas: [], hoje: HOJE, status: null, busca: null })).toMatchObject({ metas: [] });
  });

  it('formata valores, filtra por status e busca e aplica o recálculo em memória', () => {
    const metas = aplicarAtualizacoesMetas(
      [meta({}), meta({ id: 'm2', titulo: 'Leads', unidade: 'QUANTIDADE', status: 'ATRASADA' })],
      [{ id: 'm1', valorAtual: 1000, progresso: 62.5, status: 'EM_RISCO' }],
    );
    const todas = montarSituacaoMetas({ metas, hoje: HOJE, status: null, busca: null });

    expect(todas.metas).toHaveLength(2);
    expect(todas.metas[0]).toMatchObject({ valorAtual: 1000, progresso: 62.5, status: 'EM_RISCO' });
    expect(todas.metas[0].valorAlvoFormatado).toContain('R$');
    expect(montarSituacaoMetas({ metas, hoje: HOJE, status: 'ATRASADA', busca: null }).metas).toHaveLength(1);
    expect(montarSituacaoMetas({ metas, hoje: HOJE, status: null, busca: 'FATURAMENTO' }).metas).toHaveLength(1);
  });
});

describe('sprints', () => {
  const sprint = { id: 's1', nome: 'Sprint 7', status: 'ATIVA', dataInicio: '2026-11-01', dataFim: '2026-11-20', capacidadePontos: 30 };

  it('escolhe a ativa ou a pedida', () => {
    const lista = [sprint, { id: 's0', status: 'CONCLUIDA' }];

    expect(escolherSprint(lista, null)?.id).toBe('s1');
    expect(escolherSprint(lista, 's0')?.id).toBe('s0');
    expect(escolherSprint([{ id: 's0', status: 'CONCLUIDA' }], null)).toBeNull();
  });

  it('sem tarefas dá zeros; com tarefas calcula pontos, ritmo e lista abertas com responsável', () => {
    expect(montarSituacaoSprint({ sprint, tarefas: [], membros: [], hoje: HOJE })).toMatchObject({
      pontosTotais: 0,
      percentualConcluido: 0,
      tarefasAbertas: [],
    });

    const situacao = montarSituacaoSprint({
      sprint,
      tarefas: [
        { id: 't1', title: 'A', status: 'DONE', pontos: 3 },
        { id: 't2', title: 'B', status: 'IN_PROGRESS', pontos: 5, assigneeId: 'u1', prioridade: 'ALTA' },
        { id: 't3', title: 'C', status: 'TODO', pontos: 12, prioridade: 'URGENTE' },
      ],
      membros: [{ id: 'u1', name: { firstName: 'Ana', lastName: 'Lima' } }],
      hoje: HOJE,
    });

    expect(situacao).toMatchObject({ pontosTotais: 20, pontosConcluidos: 3, percentualConcluido: 15, atrasadaPeloRitmo: true, diasRestantes: 5 });
    expect(situacao.tarefasAbertas.map((tarefa) => tarefa.id)).toEqual(['t2', 't3']);
    expect(situacao.tarefasAbertas[0].responsavel).toBe('Ana Lima');
  });
});

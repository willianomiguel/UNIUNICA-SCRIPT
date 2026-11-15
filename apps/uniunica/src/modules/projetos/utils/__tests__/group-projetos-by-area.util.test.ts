import { describe, expect, it } from 'vitest';

import { groupProjetosByArea } from 'src/modules/projetos/utils/group-projetos-by-area.util';

describe('groupProjetosByArea', () => {
  it('agrupa na ordem das áreas, com "Sem área" no fim e grupos vazios omitidos', () => {
    const groups = groupProjetosByArea([
      { id: 'm', area: 'MARKETING', nome: 'Campanha' },
      { id: 'x', area: null, nome: 'Solto' },
      { id: 'd', area: 'DEV', nome: 'App' },
      { id: 'z', area: 'DESCONHECIDA', nome: 'Outro' },
    ]);

    expect(groups.map((group) => group.area)).toEqual(['DEV', 'MARKETING', 'SEM_AREA']);
    expect(groups.map((group) => group.label)).toEqual(['Desenvolvimento', 'Marketing', 'Sem área']);
    expect(groups[2].projetos.map((projeto) => projeto.id)).toEqual(['z', 'x']);
  });

  it('ordena por data de início (sem data por último) e depois por nome', () => {
    const [group] = groupProjetosByArea([
      { id: 'sem-data', area: 'DEV', nome: 'A' },
      { id: 'dez', area: 'DEV', nome: 'B', dataInicio: '2026-12-01' },
      { id: 'out', area: 'DEV', nome: 'C', dataInicio: '2026-10-01' },
      { id: 'so-fim', area: 'DEV', nome: 'D', dataFim: '2026-11-01' },
    ]);

    expect(group.projetos.map((projeto) => projeto.id)).toEqual(['out', 'so-fim', 'dez', 'sem-data']);
  });

  it('lista vazia não gera grupos', () => {
    expect(groupProjetosByArea([])).toEqual([]);
  });
});

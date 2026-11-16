import { describe, expect, it } from 'vitest';

import { extractIdeiasParaPontuar } from 'src/modules/projetos/utils/extract-ideias-para-pontuar.util';

describe('extractIdeiasParaPontuar', () => {
  it('devolve só as ideias cuja pontuação mudou', () => {
    const updates = extractIdeiasParaPontuar([
      { properties: { after: { id: 'a', impacto: 5, esforco: 1, votos: 2, pontuacao: 0 } } },
      { properties: { after: { id: 'b', impacto: 3, esforco: 3, votos: 0, pontuacao: 1 } } },
      { recordId: 'c', properties: { after: { impacto: 2, esforco: 4, votos: 0, pontuacao: null } } },
    ]);

    expect(updates).toEqual([
      { id: 'a', pontuacao: 15 },
      { id: 'c', pontuacao: 0.5 },
    ]);
  });

  it('ignora eventos sem estado posterior ou sem id', () => {
    expect(extractIdeiasParaPontuar([{ properties: {} }, { properties: { after: { impacto: 1 } } }])).toEqual([]);
  });
});

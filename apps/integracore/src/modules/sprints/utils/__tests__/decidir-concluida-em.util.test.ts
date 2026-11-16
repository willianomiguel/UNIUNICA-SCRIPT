import { describe, expect, it } from 'vitest';

import { decidirConcluidaEm } from 'src/modules/sprints/utils/decidir-concluida-em.util';

const agora = new Date('2026-11-15T12:00:00.000Z');

describe('decidirConcluidaEm', () => {
  it('grava a data quando vai para DONE', () => {
    expect(
      decidirConcluidaEm({ statusAntes: 'IN_PROGRESS', statusDepois: 'DONE', concluidaEmAtual: null, agora }),
    ).toBe('2026-11-15T12:00:00.000Z');
  });

  it('não sobrescreve data existente', () => {
    expect(
      decidirConcluidaEm({ statusAntes: 'DONE', statusDepois: 'DONE', concluidaEmAtual: '2026-11-01T00:00:00Z', agora }),
    ).toBeUndefined();
  });

  it('limpa quando sai de DONE', () => {
    expect(
      decidirConcluidaEm({ statusAntes: 'DONE', statusDepois: 'TODO', concluidaEmAtual: '2026-11-01T00:00:00Z', agora }),
    ).toBeNull();
  });

  it('não mexe em outras mudanças', () => {
    expect(
      decidirConcluidaEm({ statusAntes: 'TODO', statusDepois: 'IN_PROGRESS', concluidaEmAtual: null, agora }),
    ).toBeUndefined();
    expect(
      decidirConcluidaEm({ statusAntes: 'DONE', statusDepois: 'TODO', concluidaEmAtual: null, agora }),
    ).toBeUndefined();
  });
});

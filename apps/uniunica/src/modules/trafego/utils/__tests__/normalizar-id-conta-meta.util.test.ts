import { describe, expect, it } from 'vitest';

import { normalizarIdContaMeta } from 'src/modules/trafego/utils/normalizar-id-conta-meta.util';

describe('normalizarIdContaMeta', () => {
  it('adiciona o prefixo act_ quando falta', () => {
    expect(normalizarIdContaMeta('123')).toBe('act_123');
    expect(normalizarIdContaMeta('act_123')).toBe('act_123');
    expect(normalizarIdContaMeta(' ACT_123 ')).toBe('act_123');
    expect(normalizarIdContaMeta(123)).toBe('act_123');
  });
  it('vazio ou inválido devolve null', () => {
    expect(normalizarIdContaMeta('')).toBeNull();
    expect(normalizarIdContaMeta('abc')).toBeNull();
    expect(normalizarIdContaMeta(undefined)).toBeNull();
  });
});

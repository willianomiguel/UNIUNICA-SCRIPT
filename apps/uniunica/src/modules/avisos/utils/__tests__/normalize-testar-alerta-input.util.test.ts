import { describe, expect, it } from 'vitest';

import { normalizeTestarAlertaInput } from 'src/modules/avisos/utils/normalize-testar-alerta-input.util';

describe('normalizeTestarAlertaInput', () => {
  it('aceita o formato canônico records e remove duplicados', () => {
    expect(normalizeTestarAlertaInput({ records: [{ id: 'a' }, { id: 'a' }, { id: 'b' }] })).toEqual(['a', 'b']);
  });

  it('aceita payload de rota HTTP', () => {
    expect(normalizeTestarAlertaInput({ requestContext: {}, body: { records: [{ id: 'x' }] } })).toEqual(['x']);
  });

  it('ignora entradas inválidas', () => {
    expect(normalizeTestarAlertaInput(null)).toEqual([]);
    expect(normalizeTestarAlertaInput({ records: [{}, { id: '' }, null] })).toEqual([]);
    expect(normalizeTestarAlertaInput({ records: 'x' })).toEqual([]);
  });
});

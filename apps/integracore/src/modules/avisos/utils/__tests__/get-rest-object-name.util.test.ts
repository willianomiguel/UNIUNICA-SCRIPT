import { describe, expect, it } from 'vitest';

import { getRestObjectName } from 'src/modules/avisos/utils/get-rest-object-name.util';

describe('getRestObjectName', () => {
  it('extrai o nome plural do caminho REST', () => {
    expect(getRestObjectName('/rest/metricasTrafego')).toBe('metricasTrafego');
    expect(getRestObjectName('rest/alertas/123')).toBe('alertas');
  });
});

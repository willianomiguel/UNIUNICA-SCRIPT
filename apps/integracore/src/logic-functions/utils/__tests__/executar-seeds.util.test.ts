import { describe, expect, it } from 'vitest';

import { executarSeeds } from 'src/logic-functions/utils/executar-seeds.util';

describe('executarSeeds', () => {
  it('roda todos os seeds em ordem e continua depois de uma falha', async () => {
    const ordem: string[] = [];
    const resultados = await executarSeeds([
      { modulo: 'a', executar: async () => { ordem.push('a'); } },
      { modulo: 'b', executar: async () => { throw new Error('falhou'); } },
      { modulo: 'c', executar: async () => { ordem.push('c'); } },
    ]);

    expect(ordem).toEqual(['a', 'c']);
    expect(resultados).toEqual([
      { modulo: 'a', ok: true },
      { modulo: 'b', ok: false, erro: 'falhou' },
      { modulo: 'c', ok: true },
    ]);
  });
});

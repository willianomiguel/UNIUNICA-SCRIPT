import { beforeEach, describe, expect, it, vi } from 'vitest';

type Registro = { id: string; idExterno: string; gateway: string; status: string };

const banco: Registro[] = [];

vi.mock('twenty-client-sdk/core', () => ({
  CoreApiClient: class {
    async query(consulta: { vendas: { __args: { filter: Record<string, { eq?: string; in?: string[] }> } } }) {
      const filtro = consulta.vendas.__args.filter;
      const encontrados = banco.filter(
        (registro) =>
          (filtro.idExterno.in === undefined || filtro.idExterno.in.includes(registro.idExterno)) &&
          (filtro.idExterno.eq === undefined || filtro.idExterno.eq === registro.idExterno) &&
          (filtro.gateway === undefined || filtro.gateway.eq === registro.gateway),
      );

      return { vendas: { edges: encontrados.map((node) => ({ node: { ...node, dataEvento: null } })) } };
    }

    async mutation(mutacao: { createVenda?: { __args: { data: Registro } } }) {
      if (mutacao.createVenda) {
        const registro = { ...mutacao.createVenda.__args.data, id: `id-${banco.length + 1}` };

        banco.push(registro);

        return { createVenda: registro };
      }

      throw new Error('mutação inesperada');
    }
  },
}));

const { default: seedVendas } = await import('src/modules/vendas/seed/seed-vendas');

describe('seedVendas', () => {
  beforeEach(() => {
    banco.length = 0;
  });

  it('creates the example sales once and is idempotent', async () => {
    await seedVendas();
    const primeiraExecucao = banco.map((registro) => registro.idExterno);

    await seedVendas();

    expect(primeiraExecucao.length).toBeGreaterThan(0);
    expect(banco.map((registro) => registro.idExterno)).toEqual(primeiraExecucao);
  });
});

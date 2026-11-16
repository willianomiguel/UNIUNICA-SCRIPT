import { describe, expect, it } from 'vitest';

import { gerarOcorrenciasRecorrentes } from 'src/modules/financeiro/utils/gerar-ocorrencias-recorrentes.util';
import { criarClienteRestFalso } from 'src/modules/financeiro/utils/__tests__/helpers/criar-cliente-rest-falso';

const recorrente = {
  id: 'raiz',
  descricao: 'Ferramentas',
  tipo: 'SAIDA',
  valor: { amountMicros: 640_000_000, currencyCode: 'BRL' },
  data: '2026-10-31',
  vencimento: '2026-10-31',
  status: 'PAGO',
  recorrencia: 'MENSAL',
};

describe('gerarOcorrenciasRecorrentes', () => {
  it('gera as ocorrências até o horizonte e não duplica ao rodar de novo', async () => {
    const { cliente, banco } = criarClienteRestFalso({
      lancamentos: [
        recorrente,
        { ...recorrente, id: 'futuro', data: '2027-06-01', vencimento: null },
        { ...recorrente, id: 'cancelado', status: 'CANCELADO' },
        { ...recorrente, id: 'unico', recorrencia: 'NENHUMA' },
      ],
    });

    const primeira = await gerarOcorrenciasRecorrentes(cliente, '2026-11-15');

    // 31/10 já passou → cria 30/11; 30/11 ainda não chegou → para.
    expect(primeira).toEqual({ criados: 1, ignorados: 0 });
    const criada = banco.lancamentos.find((registro) => registro.origem === 'RECORRENCIA');

    expect(criada).toMatchObject({
      data: '2026-11-30',
      status: 'PENDENTE',
      recorrenciaRaizId: 'raiz',
      chaveIdempotencia: 'recorrencia:raiz:2026-11-30',
    });
    expect(banco.lancamentos.find((registro) => registro.id === 'raiz')?.proximaOcorrenciaGerada).toBe(true);

    expect(await gerarOcorrenciasRecorrentes(cliente, '2026-11-15')).toEqual({
      criados: 0,
      ignorados: 0,
    });
    expect(banco.lancamentos).toHaveLength(5);
  });

  it('com antecedência, gera também as ocorrências que caem no horizonte', async () => {
    const { cliente } = criarClienteRestFalso({ lancamentos: [recorrente] });

    // horizonte 15/12: 31/10 → 30/11 (no horizonte) → 31/12 (fora).
    expect(await gerarOcorrenciasRecorrentes(cliente, '2026-11-15', 30)).toEqual({
      criados: 2,
      ignorados: 0,
    });
  });

  it('recupera execuções atrasadas mantendo o dia âncora', async () => {
    const { cliente, banco } = criarClienteRestFalso({ lancamentos: [recorrente] });

    expect(await gerarOcorrenciasRecorrentes(cliente, '2027-01-20', 0)).toEqual({
      criados: 3,
      ignorados: 0,
    });
    expect(
      banco.lancamentos
        .filter((registro) => registro.origem === 'RECORRENCIA')
        .map((registro) => registro.data),
    ).toEqual(['2026-11-30', '2026-12-31', '2027-01-31']);
  });

  it('não duplica quando a ocorrência já existe mas a origem não foi marcada', async () => {
    const { cliente, banco } = criarClienteRestFalso({
      lancamentos: [
        recorrente,
        {
          ...recorrente,
          id: 'existente',
          data: '2026-11-30',
          recorrenciaRaizId: 'raiz',
          chaveIdempotencia: 'recorrencia:raiz:2026-11-30',
          proximaOcorrenciaGerada: true,
        },
      ],
    });

    expect(await gerarOcorrenciasRecorrentes(cliente, '2026-11-15', 30)).toEqual({
      criados: 0,
      ignorados: 1,
    });
    expect(banco.lancamentos).toHaveLength(2);
  });
});

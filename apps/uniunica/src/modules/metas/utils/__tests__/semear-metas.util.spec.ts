import { describe, expect, it } from 'vitest';

import { semearMetas } from 'src/modules/metas/utils/semear-metas.util';
import { criarClienteRestFalso } from 'src/modules/financeiro/utils/__tests__/helpers/criar-cliente-rest-falso';

describe('semearMetas', () => {
  it('cria o OKR do trimestre ligado à meta pai e não duplica', async () => {
    const { cliente, banco } = criarClienteRestFalso();

    expect(await semearMetas(cliente, '2026-11-15')).toBe(3);

    const [objetivo, faturamento, conteudos] = banco.metas;

    expect(objetivo).toMatchObject({ periodo: '2026-T4', fonte: 'MANUAL' });
    expect(faturamento).toMatchObject({
      titulo: 'Faturamento do trimestre',
      fonte: 'FATURAMENTO_BRUTO',
      dataInicio: '2026-10-01',
      dataFim: '2026-12-31',
      metaPaiId: objetivo.id,
    });
    expect(conteudos.metaPaiId).toBe(objetivo.id);

    expect(await semearMetas(cliente, '2026-11-20')).toBe(0);
    expect(banco.metas).toHaveLength(3);
  });
});

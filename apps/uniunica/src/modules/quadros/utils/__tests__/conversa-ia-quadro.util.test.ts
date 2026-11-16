import { describe, expect, it } from 'vitest';

import {
  montarMensagensIa,
  traduzirErroIa,
  validarEntradaConversaIa,
} from 'src/modules/quadros/utils/conversa-ia-quadro.util';

const QUADRO_ID = 'dc18d6f3-bc9d-4749-9a21-1e8f6efe5521';

describe('conversa-ia-quadro', () => {
  it('valida a entrada e limpa o histórico', () => {
    expect(validarEntradaConversaIa({ quadroId: 'x', mensagem: 'oi' })).toMatchObject({ ok: false });
    expect(validarEntradaConversaIa({ quadroId: QUADRO_ID, mensagem: '   ' })).toMatchObject({ ok: false });

    const entrada = validarEntradaConversaIa({
      quadroId: QUADRO_ID,
      mensagem: ' desenhe ',
      historico: [{ papel: 'usuario', texto: 'a' }, { papel: 'hacker', texto: 'b' }, 'lixo'],
    });

    expect(entrada).toEqual({
      ok: true,
      valor: { quadroId: QUADRO_ID, mensagem: 'desenhe', historico: [{ papel: 'usuario', texto: 'a' }] },
    });
  });

  it('a última mensagem leva o id do quadro', () => {
    const mensagens = montarMensagensIa({
      quadroId: QUADRO_ID,
      mensagem: 'desenhe',
      historico: [{ papel: 'ia', texto: 'feito' }],
    });

    expect(mensagens[0]).toEqual({ role: 'assistant', content: 'feito' });
    expect(mensagens[1].content).toContain(QUADRO_ID);
  });

  it('traduz erro de provedor em texto claro', () => {
    expect(traduzirErroIa('No AI models are available. Configure at least one AI provider.')).toMatch(/não está configurada/);
    expect(traduzirErroIa('timeout')).toMatch(/Tente de novo/);
  });
});

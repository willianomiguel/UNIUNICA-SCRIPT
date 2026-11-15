import { describe, expect, it } from 'vitest';

import { formatarMensagemAcaoSprint } from 'src/modules/sprints/utils/formatar-mensagem-acao-sprint.util';

describe('formatarMensagemAcaoSprint', () => {
  it('uma sprint', () => {
    expect(formatarMensagemAcaoSprint('iniciada', { sucesso: 1, ignoradas: 0, falhas: 0 })).toBe('Sprint iniciada');
  });

  it('várias, com ignoradas, erros e detalhe', () => {
    expect(
      formatarMensagemAcaoSprint('encerrada', {
        sucesso: 2,
        ignoradas: 1,
        falhas: 1,
        mensagens: ['3 tarefas movidas para Sprint 13.'],
      }),
    ).toBe('2 sprints encerradas, 1 ignorada, 1 com erro. 3 tarefas movidas para Sprint 13.');
  });

  it('nada a fazer', () => {
    expect(formatarMensagemAcaoSprint('iniciada', { sucesso: 0, ignoradas: 0, falhas: 0 })).toBe('Nada a fazer');
  });
});

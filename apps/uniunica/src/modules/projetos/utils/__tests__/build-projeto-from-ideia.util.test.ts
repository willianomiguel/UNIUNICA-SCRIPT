import { describe, expect, it } from 'vitest';

import { buildProjetoFromIdeia } from 'src/modules/projetos/utils/build-projeto-from-ideia.util';

const today = Date.UTC(2026, 10, 15);

describe('buildProjetoFromIdeia', () => {
  it('herda título, área e descrição e nasce planejado no trimestre atual', () => {
    expect(
      buildProjetoFromIdeia(
        {
          id: 'i1',
          titulo: '  Portal do aluno  ',
          area: 'DEV',
          pontuacao: 7.5,
          descricao: { markdown: 'Texto', blocknote: '[]' },
        },
        today,
      ),
    ).toEqual({
      nome: 'Portal do aluno',
      status: 'PLANEJADO',
      prioridade: 'ALTA',
      progresso: 0,
      trimestre: '2026-T4',
      area: 'DEV',
      descricao: { markdown: 'Texto', blocknote: '[]' },
    });
  });

  it('usa valores padrão quando a ideia está incompleta', () => {
    expect(buildProjetoFromIdeia({ id: 'i2', titulo: ' ', pontuacao: 1 }, today)).toEqual({
      nome: 'Projeto sem título',
      status: 'PLANEJADO',
      prioridade: 'MEDIA',
      progresso: 0,
      trimestre: '2026-T4',
    });
  });
});

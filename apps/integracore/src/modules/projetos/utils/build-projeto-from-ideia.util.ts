import { type IdeiaRecord } from 'src/modules/projetos/types/ideia-record';
import { getTrimestreLabel } from 'src/modules/projetos/utils/get-trimestre-label.util';

// Dados do projeto criado pela ação "Transformar em projeto".
// Herda título, descrição e área; nasce PLANEJADO no trimestre atual.
// Pontuação 5 ou mais vira prioridade ALTA, senão MEDIA.
export const buildProjetoFromIdeia = (
  ideia: IdeiaRecord,
  todayMs: number,
): Record<string, unknown> => {
  const titulo = ideia.titulo?.trim();
  const markdown = ideia.descricao?.markdown?.trim();

  return {
    nome: titulo && titulo.length > 0 ? titulo : 'Projeto sem título',
    status: 'PLANEJADO',
    prioridade: (ideia.pontuacao ?? 0) >= 5 ? 'ALTA' : 'MEDIA',
    progresso: 0,
    trimestre: getTrimestreLabel(todayMs),
    ...(ideia.area ? { area: ideia.area } : {}),
    ...(markdown ? { descricao: { markdown, blocknote: ideia.descricao?.blocknote ?? null } } : {}),
  };
};

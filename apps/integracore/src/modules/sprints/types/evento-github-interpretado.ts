import { type AcaoGithub } from 'src/modules/sprints/types/acao-github';

export type EventoGithubInterpretado = {
  codigos: string[];
  acao: AcaoGithub;
  prUrl: string | null;
  prTitulo: string | null;
  branch: string | null;
};

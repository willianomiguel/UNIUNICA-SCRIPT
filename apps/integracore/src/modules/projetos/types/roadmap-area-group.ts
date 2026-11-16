import { type ProjetoRecord } from 'src/modules/projetos/types/projeto-record';

// Grupo de projetos de uma área no Roadmap.
export type RoadmapAreaGroup = {
  area: string;
  label: string;
  projetos: ProjetoRecord[];
};

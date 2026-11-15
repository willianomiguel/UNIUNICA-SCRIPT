import { type RestClientLike } from 'src/modules/projetos/types/rest-client-like';
import { calcularPontuacaoIdeia } from 'src/modules/projetos/utils/calcular-pontuacao-ideia.util';
import { fetchAllRestRecords } from 'src/modules/projetos/utils/fetch-all-rest-records.util';

const PROJETOS_INICIAIS = [
  {
    nome: 'Site institucional v2',
    area: 'DEV',
    status: 'CONCLUIDO',
    prioridade: 'MEDIA',
    dataInicio: '2026-10-01',
    dataFim: '2026-10-31',
    progresso: 100,
    trimestre: '2026-T4',
  },
  {
    nome: 'Nova plataforma de matrículas',
    area: 'DEV',
    status: 'EM_ANDAMENTO',
    prioridade: 'ALTA',
    dataInicio: '2026-10-05',
    dataFim: '2026-12-18',
    progresso: 45,
    trimestre: '2026-T4',
  },
  {
    nome: 'Campanha de Black Friday',
    area: 'MARKETING',
    status: 'EM_ANDAMENTO',
    prioridade: 'URGENTE',
    dataInicio: '2026-11-01',
    dataFim: '2026-11-30',
    progresso: 70,
    trimestre: '2026-T4',
  },
  {
    nome: 'Planejamento estratégico 2027',
    area: 'ESTRATEGIA',
    status: 'PLANEJADO',
    prioridade: 'ALTA',
    dataInicio: '2026-11-20',
    dataFim: '2027-01-31',
    progresso: 10,
    trimestre: '2026-T4',
  },
  {
    nome: 'Automação da conciliação financeira',
    area: 'FINANCEIRO',
    status: 'PLANEJADO',
    prioridade: 'MEDIA',
    dataInicio: '2027-01-11',
    dataFim: '2027-03-19',
    progresso: 0,
    trimestre: '2027-T1',
  },
  {
    nome: 'Onboarding de novos alunos',
    area: 'OPERACAO',
    status: 'PAUSADO',
    prioridade: 'BAIXA',
    dataInicio: '2027-02-01',
    dataFim: '2027-03-31',
    progresso: 0,
    trimestre: '2027-T1',
  },
];

const IDEIAS_INICIAIS = [
  {
    titulo: 'Programa de indicação com desconto',
    area: 'MARKETING',
    status: 'EM_ANALISE',
    impacto: 4,
    esforco: 2,
    votos: 3,
  },
  {
    titulo: 'App mobile para alunos',
    area: 'DEV',
    status: 'NOVA',
    impacto: 5,
    esforco: 5,
    votos: 2,
  },
  {
    titulo: 'Painel semanal de indicadores',
    area: 'ESTRATEGIA',
    status: 'APROVADA',
    impacto: 4,
    esforco: 1,
    votos: 1,
  },
  {
    titulo: 'Cobrança automática por Pix',
    area: 'FINANCEIRO',
    status: 'NOVA',
    impacto: 3,
    esforco: 2,
    votos: 0,
  },
  {
    titulo: 'Podcast mensal da UniÚnica',
    area: 'MARKETING',
    status: 'DESCARTADA',
    impacto: 2,
    esforco: 4,
    votos: 0,
  },
];

const findPrimeiroMembroId = async (client: RestClientLike): Promise<string | null> => {
  try {
    const response = await client.get<{ data?: { workspaceMembers?: Array<{ id: string }> } }>(
      '/rest/workspaceMembers',
      { query: { limit: 1 } },
    );

    return response?.data?.workspaceMembers?.[0]?.id ?? null;
  } catch {
    return null;
  }
};

// Dados iniciais do módulo projetos. Idempotente: só cria projetos/ideias cujo
// nome/título ainda não existe.
export const seedProjetosWithClient = async (client: RestClientLike): Promise<void> => {
  const membroId = await findPrimeiroMembroId(client);

  const projetosExistentes = await fetchAllRestRecords<{ nome?: string | null }>(client, 'projetos');
  const nomesExistentes = new Set(projetosExistentes.map((projeto) => projeto.nome));

  for (const projeto of PROJETOS_INICIAIS) {
    if (!nomesExistentes.has(projeto.nome)) {
      await client.post('/rest/projetos', {
        ...projeto,
        ...(membroId ? { responsavelId: membroId } : {}),
      });
    }
  }

  const ideiasExistentes = await fetchAllRestRecords<{ titulo?: string | null }>(client, 'ideias');
  const titulosExistentes = new Set(ideiasExistentes.map((ideia) => ideia.titulo));

  for (const ideia of IDEIAS_INICIAIS) {
    if (!titulosExistentes.has(ideia.titulo)) {
      await client.post('/rest/ideias', {
        ...ideia,
        pontuacao: calcularPontuacaoIdeia(ideia),
        ...(membroId ? { autorId: membroId } : {}),
      });
    }
  }
};

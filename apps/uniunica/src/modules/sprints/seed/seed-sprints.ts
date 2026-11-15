import { RestApiClient } from 'twenty-client-sdk/rest';

import { gerarProximoCodigoTarefa } from 'src/modules/sprints/services/gerar-proximo-codigo-tarefa.service';
import { listarRegistros } from 'src/modules/sprints/services/listar-registros.service';
import { recalcularPontosSprint } from 'src/modules/sprints/services/recalcular-pontos-sprint.service';
import { type SprintResumo } from 'src/modules/sprints/types/sprint-resumo';
import { type TarefaSprint } from 'src/modules/sprints/types/tarefa-sprint';

type SprintSemente = {
  chave: 'ativa' | 'planejada';
  nome: string;
  objetivo: string;
  status: 'ATIVA' | 'PLANEJADA';
  dataInicio: string;
  dataFim: string;
  capacidadePontos: number;
  historicoBurndown?: Array<{ data: string; pontosRestantes: number; pontosTotais: number }>;
};

type TarefaSemente = {
  titulo: string;
  sprint: 'ativa' | 'planejada';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  pontos: number;
  tipo: string;
  prioridade: string;
  concluidaEm?: string;
  pai?: string;
  bloqueadaPor?: string;
};

const SPRINTS: SprintSemente[] = [
  {
    chave: 'ativa',
    nome: 'Sprint 12 — Login e onboarding',
    objetivo: 'Novo fluxo de login e primeira experiência do aluno',
    status: 'ATIVA',
    dataInicio: '2026-11-10',
    dataFim: '2026-11-24',
    capacidadePontos: 30,
    historicoBurndown: [
      { data: '2026-11-10', pontosRestantes: 29, pontosTotais: 29 },
      { data: '2026-11-11', pontosRestantes: 29, pontosTotais: 29 },
      { data: '2026-11-12', pontosRestantes: 26, pontosTotais: 29 },
      { data: '2026-11-13', pontosRestantes: 21, pontosTotais: 29 },
      { data: '2026-11-14', pontosRestantes: 21, pontosTotais: 29 },
    ],
  },
  {
    chave: 'planejada',
    nome: 'Sprint 13 — Pagamentos',
    objetivo: 'Checkout com Pix e cartão e recibos automáticos',
    status: 'PLANEJADA',
    dataInicio: '2026-11-24',
    dataFim: '2026-12-08',
    capacidadePontos: 30,
  },
];

const TAREFAS: TarefaSemente[] = [
  { titulo: 'Tela de login com e-mail e senha', sprint: 'ativa', status: 'DONE', pontos: 5, tipo: 'FEATURE', prioridade: 'ALTA', concluidaEm: '2026-11-13T18:00:00.000Z' },
  { titulo: 'Corrigir redirecionamento após logout', sprint: 'ativa', status: 'DONE', pontos: 3, tipo: 'BUG', prioridade: 'URGENTE', concluidaEm: '2026-11-12T15:30:00.000Z' },
  { titulo: 'Recuperação de senha por e-mail', sprint: 'ativa', status: 'IN_PROGRESS', pontos: 5, tipo: 'FEATURE', prioridade: 'ALTA' },
  { titulo: 'Configurar envio de e-mails transacionais', sprint: 'ativa', status: 'IN_PROGRESS', pontos: 3, tipo: 'TECNICO', prioridade: 'MEDIA', pai: 'Recuperação de senha por e-mail' },
  { titulo: 'Tour de boas-vindas do aluno', sprint: 'ativa', status: 'TODO', pontos: 8, tipo: 'FEATURE', prioridade: 'MEDIA', bloqueadaPor: 'Tela de login com e-mail e senha' },
  { titulo: 'Melhorar mensagens de erro do formulário', sprint: 'ativa', status: 'TODO', pontos: 5, tipo: 'MELHORIA', prioridade: 'BAIXA' },
  { titulo: 'Checkout com Pix', sprint: 'planejada', status: 'TODO', pontos: 8, tipo: 'FEATURE', prioridade: 'ALTA' },
  { titulo: 'Recibo automático por e-mail', sprint: 'planejada', status: 'TODO', pontos: 5, tipo: 'FEATURE', prioridade: 'MEDIA', bloqueadaPor: 'Checkout com Pix' },
];

const aspas = (texto: string) => `"${texto.replace(/"/g, '\\"')}"`;

const buscarPorCampo = async <T>(
  cliente: RestApiClient,
  plural: string,
  campo: string,
  valor: string,
): Promise<T | undefined> => {
  const [registro] = await listarRegistros<T>(cliente, plural, {
    filter: `${campo}[eq]:${aspas(valor)}`,
    depth: '0',
  });

  return registro;
};

// Dados iniciais do módulo sprints: 1 sprint ATIVA, 1 PLANEJADA e 8 tarefas.
// Idempotente: procura sprints pelo nome e tarefas pelo título antes de criar.
const seedSprints = async (): Promise<void> => {
  const cliente = new RestApiClient();
  const sprintIds: Record<string, string> = {};

  for (const semente of SPRINTS) {
    const existente = await buscarPorCampo<SprintResumo>(cliente, 'sprints', 'nome', semente.nome);

    if (existente) {
      sprintIds[semente.chave] = existente.id;
      continue;
    }

    const dados = {
      nome: semente.nome,
      objetivo: semente.objetivo,
      status: semente.status,
      dataInicio: semente.dataInicio,
      dataFim: semente.dataFim,
      capacidadePontos: semente.capacidadePontos,
      historicoBurndown: semente.historicoBurndown ?? null,
    };
    const resposta = await cliente.post<{ data?: { createSprint?: { id: string } } }>(
      '/rest/sprints',
      dados,
    );
    const id = resposta.data?.createSprint?.id;

    if (!id) {
      throw new Error(`Não foi possível criar a sprint ${semente.nome}`);
    }

    sprintIds[semente.chave] = id;
  }

  const tarefaIds: Record<string, string> = {};

  for (const semente of TAREFAS) {
    const existente = await buscarPorCampo<TarefaSprint>(cliente, 'tasks', 'title', semente.titulo);

    if (existente) {
      tarefaIds[semente.titulo] = existente.id;
      continue;
    }

    const { numero, codigo } = await gerarProximoCodigoTarefa(cliente);
    const resposta = await cliente.post<{ data?: { createTask?: { id: string } } }>(
      '/rest/tasks',
      {
        title: semente.titulo,
        status: semente.status,
        pontos: semente.pontos,
        tipo: semente.tipo,
        prioridade: semente.prioridade,
        numero,
        codigo,
        sprintId: sprintIds[semente.sprint],
        ...(semente.concluidaEm ? { concluidaEm: semente.concluidaEm } : {}),
      },
    );
    const id = resposta.data?.createTask?.id;

    if (!id) {
      throw new Error(`Não foi possível criar a tarefa ${semente.titulo}`);
    }

    tarefaIds[semente.titulo] = id;
  }

  for (const semente of TAREFAS) {
    const ligacoes: Record<string, string> = {};

    if (semente.pai && tarefaIds[semente.pai]) {
      ligacoes.tarefaPaiId = tarefaIds[semente.pai];
    }

    if (semente.bloqueadaPor && tarefaIds[semente.bloqueadaPor]) {
      ligacoes.bloqueadaPorId = tarefaIds[semente.bloqueadaPor];
    }

    if (Object.keys(ligacoes).length > 0) {
      await cliente.patch(`/rest/tasks/${tarefaIds[semente.titulo]}`, ligacoes);
    }
  }

  for (const semente of SPRINTS) {
    await recalcularPontosSprint(cliente, sprintIds[semente.chave], {
      registrarFoto: semente.status === 'ATIVA',
    });
  }
};

export default seedSprints;

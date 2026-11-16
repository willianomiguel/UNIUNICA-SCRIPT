import { type ResultadoAcaoSprint } from 'src/modules/sprints/types/resultado-acao-sprint';

// Resumo de uma ação em lote (iniciar/encerrar sprints).
export const resumirResultadosAcao = (resultados: ResultadoAcaoSprint[]) => ({
  ok: resultados.every((r) => r.status !== 'FALHOU'),
  sucesso: resultados.filter((r) => r.status === 'OK').length,
  ignoradas: resultados.filter((r) => r.status === 'IGNORADA').length,
  naoEncontradas: resultados.filter((r) => r.status === 'NAO_ENCONTRADA').length,
  falhas: resultados.filter((r) => r.status === 'FALHOU').length,
  resultados,
});

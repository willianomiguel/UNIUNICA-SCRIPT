import { type ClienteRest } from 'src/modules/financeiro/types/cliente-rest';
import { type RegistroIntegraCore } from 'src/modules/financeiro/types/registro-integracore';
import { existeLancamentoComChave } from 'src/modules/financeiro/utils/existe-lancamento-com-chave.util';
import { extrairRegistroResposta } from 'src/modules/financeiro/utils/extrair-registro-resposta.util';
import { listarRegistros } from 'src/modules/financeiro/utils/listar-registros.util';
import { montarProximaOcorrencia } from 'src/modules/financeiro/utils/montar-proxima-ocorrencia.util';

const LIMITE_POR_EXECUCAO = 500;

const dataDe = (registro: RegistroIntegraCore): string | null => {
  const referencia = registro.data ?? registro.vencimento;

  return typeof referencia === 'string' ? referencia.slice(0, 10) : null;
};

// Cria a próxima ocorrência de cada lançamento recorrente cuja data já está
// dentro do horizonte (hoje + `diasAntecedencia`). Idempotente: a chave
// `recorrencia:<raiz>:<data>` impede duplicatas e o lançamento de origem é
// marcado com `proximaOcorrenciaGerada`.
export const gerarOcorrenciasRecorrentes = async (
  cliente: ClienteRest,
  hoje: string,
  diasAntecedencia = 0,
): Promise<{ criados: number; ignorados: number }> => {
  const horizonte = new Date(Date.parse(hoje) + diasAntecedencia * 86_400_000)
    .toISOString()
    .slice(0, 10);
  const fila = (
    await listarRegistros(
      cliente,
      'lancamentos',
      'recorrencia[neq]:NENHUMA,proximaOcorrenciaGerada[eq]:false',
    )
  ).filter((registro) => registro.status !== 'CANCELADO');
  const datasRaiz = new Map<string, string | null>();

  for (const registro of fila) {
    if (!registro.recorrenciaRaizId) {
      datasRaiz.set(registro.id, dataDe(registro));
    }
  }

  let criados = 0;
  let ignorados = 0;

  for (let indice = 0; indice < fila.length && indice < LIMITE_POR_EXECUCAO; indice++) {
    const registro = fila[indice];
    const referencia = dataDe(registro);

    if (referencia === null || referencia > horizonte) {
      continue;
    }

    const raizId =
      typeof registro.recorrenciaRaizId === 'string' && registro.recorrenciaRaizId
        ? registro.recorrenciaRaizId
        : registro.id;

    if (!datasRaiz.has(raizId)) {
      const raiz = await cliente
        .get(`/rest/lancamentos/${raizId}`)
        .then(extrairRegistroResposta)
        .catch(() => null);

      datasRaiz.set(raizId, raiz ? dataDe(raiz) : null);
    }

    const proxima = montarProximaOcorrencia(registro, datasRaiz.get(raizId));

    if (proxima === null) {
      continue;
    }

    if (await existeLancamentoComChave(cliente, proxima.chaveIdempotencia)) {
      ignorados += 1;
    } else {
      const criado = extrairRegistroResposta(
        await cliente.post('/rest/lancamentos', proxima),
      );

      criados += 1;

      // A nova ocorrência também pode já estar no horizonte (atraso de execução).
      if (criado) {
        fila.push({ ...proxima, ...criado, proximaOcorrenciaGerada: false });
      }
    }

    await cliente.patch(`/rest/lancamentos/${registro.id}`, {
      proximaOcorrenciaGerada: true,
    });
  }

  return { criados, ignorados };
};

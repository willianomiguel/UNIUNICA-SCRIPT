import { type ClienteRest } from 'src/modules/financeiro/types/cliente-rest';
import { estaAtrasado } from 'src/modules/financeiro/utils/esta-atrasado.util';
import { listarRegistros } from 'src/modules/financeiro/utils/listar-registros.util';
import { normalizarLancamento } from 'src/modules/financeiro/utils/normalizar-lancamento.util';

// Muda para ATRASADO os lançamentos pendentes vencidos. Devolve os IDs alterados.
export const marcarLancamentosAtrasados = async (
  cliente: ClienteRest,
  hoje: string,
): Promise<string[]> => {
  const pendentes = await listarRegistros(
    cliente,
    'lancamentos',
    'status[eq]:PENDENTE',
  );
  const atrasados = pendentes.filter((registro) =>
    estaAtrasado(normalizarLancamento(registro), hoje),
  );

  for (const registro of atrasados) {
    await cliente.patch(`/rest/lancamentos/${registro.id}`, {
      status: 'ATRASADO',
    });
  }

  return atrasados.map((registro) => registro.id);
};

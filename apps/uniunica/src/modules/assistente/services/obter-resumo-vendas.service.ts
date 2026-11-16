import { type IntervaloIso } from 'src/modules/assistente/types/intervalo-iso';
import { type ResumoVendas } from 'src/modules/assistente/types/resumo-vendas';
import { montarResumoVendas } from 'src/modules/assistente/utils/montar-resumo-vendas.util';
import { obterIntervaloAnteriorIso } from 'src/modules/assistente/utils/obter-intervalo-anterior-iso.util';
import { type ClienteRest } from 'src/modules/financeiro/types/cliente-rest';
import { listarRegistros } from 'src/modules/financeiro/utils/listar-registros.util';
import { type RegistroVendaApi } from 'src/modules/vendas/types/registro-venda-api';
import { mapearRegistroVenda } from 'src/modules/vendas/utils/mapear-registro-venda.util';

// Carrega as vendas desde o início do período anterior (para a comparação) e resume.
export const obterResumoVendas = async (
  cliente: ClienteRest,
  intervalo: IntervaloIso,
): Promise<ResumoVendas> => {
  const desde = obterIntervaloAnteriorIso(intervalo).inicio;
  const registros = await listarRegistros(
    cliente,
    'vendas',
    `dataEvento[gte]:${JSON.stringify(`${desde}T00:00:00.000-03:00`)}`,
  );

  return montarResumoVendas({
    vendas: registros.map((registro) => mapearRegistroVenda(registro as RegistroVendaApi)),
    intervalo,
  });
};

import { type ClienteRest } from 'src/modules/financeiro/types/cliente-rest';
import { type RegistroIntegraCore } from 'src/modules/financeiro/types/registro-integracore';
import { listarRegistros } from 'src/modules/financeiro/utils/listar-registros.util';
import { type DadosFontes } from 'src/modules/metas/types/dados-fontes';
import { type FonteMeta } from 'src/modules/metas/types/fonte-meta';

const OBJETO_POR_FONTE: Partial<Record<FonteMeta, keyof DadosFontes>> = {
  FATURAMENTO_BRUTO: 'vendas',
  FATURAMENTO_LIQUIDO: 'vendas',
  VENDAS_APROVADAS: 'vendas',
  TAXA_CHARGEBACK: 'vendas',
  LUCRO: 'lancamentos',
  LEADS: 'metricasTrafego',
  CLIQUES: 'metricasTrafego',
};

// Carrega só os objetos usados pelas fontes informadas. Um objeto que não
// existe (módulo não instalado) vira `null` em vez de derrubar o recálculo.
export const carregarDadosFontes = async (
  cliente: ClienteRest,
  fontes: FonteMeta[],
): Promise<DadosFontes> => {
  const necessarios = new Set(
    fontes.map((fonte) => OBJETO_POR_FONTE[fonte]).filter((objeto) => objeto !== undefined),
  );

  const carregar = async (plural: keyof DadosFontes): Promise<RegistroIntegraCore[] | null> => {
    if (!necessarios.has(plural)) return null;

    try {
      return await listarRegistros(cliente, plural);
    } catch (erro) {
      console.warn(`[metas] fonte "${plural}" indisponível`, erro);

      return null;
    }
  };

  const [vendas, lancamentos, metricasTrafego] = await Promise.all([
    carregar('vendas'),
    carregar('lancamentos'),
    carregar('metricasTrafego'),
  ]);

  return { vendas, lancamentos, metricasTrafego };
};

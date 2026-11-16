import { type IntervaloIso } from 'src/modules/assistente/types/intervalo-iso';
import { type ResumoFinanceiro } from 'src/modules/assistente/types/resumo-financeiro';
import { montarResumoFinanceiro } from 'src/modules/assistente/utils/montar-resumo-financeiro.util';
import { type ClienteRest } from 'src/modules/financeiro/types/cliente-rest';
import { carregarDadosFinanceiros } from 'src/modules/financeiro/utils/carregar-dados-financeiros.util';

export const obterResumoFinanceiro = async (
  cliente: ClienteRest,
  intervalo: IntervaloIso,
  hoje: string,
): Promise<ResumoFinanceiro> =>
  montarResumoFinanceiro({ dados: await carregarDadosFinanceiros(cliente), intervalo, hoje });

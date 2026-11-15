import { type ClienteRest } from 'src/modules/financeiro/types/cliente-rest';
import { type DadosFinanceiros } from 'src/modules/financeiro/types/dados-financeiros';
import { listarRegistros } from 'src/modules/financeiro/utils/listar-registros.util';
import { normalizarCategoria } from 'src/modules/financeiro/utils/normalizar-categoria.util';
import { normalizarLancamento } from 'src/modules/financeiro/utils/normalizar-lancamento.util';

export const carregarDadosFinanceiros = async (
  cliente: ClienteRest,
): Promise<DadosFinanceiros> => {
  const [lancamentos, categorias] = await Promise.all([
    listarRegistros(cliente, 'lancamentos'),
    listarRegistros(cliente, 'categoriasFinanceiras'),
  ]);

  return {
    lancamentos: lancamentos.map(normalizarLancamento),
    categorias: categorias.map(normalizarCategoria),
  };
};

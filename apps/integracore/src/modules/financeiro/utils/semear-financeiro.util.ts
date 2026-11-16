import { CATEGORIAS_PADRAO } from 'src/modules/financeiro/constants/categorias-padrao';
import { type ClienteRest } from 'src/modules/financeiro/types/cliente-rest';
import { listarRegistros } from 'src/modules/financeiro/utils/listar-registros.util';

// Cria as categorias padrão que ainda não existem (por nome), com orçamento zero.
// Não cria lançamentos: o app não instala dados de exemplo. Idempotente.
export const semearFinanceiro = async (
  cliente: ClienteRest,
): Promise<{ categoriasCriadas: number }> => {
  const existentes = await listarRegistros(cliente, 'categoriasFinanceiras');
  const nomesExistentes = new Set(
    existentes.flatMap((categoria) => (typeof categoria.nome === 'string' ? [categoria.nome] : [])),
  );

  let categoriasCriadas = 0;

  for (const categoria of CATEGORIAS_PADRAO) {
    if (nomesExistentes.has(categoria.nome)) {
      continue;
    }

    await cliente.post('/rest/categoriasFinanceiras', {
      nome: categoria.nome,
      tipo: categoria.tipo,
      cor: categoria.cor,
      orcamentoMensal: { amountMicros: 0, currencyCode: 'BRL' },
    });

    categoriasCriadas += 1;
  }

  return { categoriasCriadas };
};

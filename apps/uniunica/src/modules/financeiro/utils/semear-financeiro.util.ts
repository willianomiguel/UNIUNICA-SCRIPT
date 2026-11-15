import { CATEGORIAS_PADRAO } from 'src/modules/financeiro/constants/categorias-padrao';
import { LANCAMENTOS_EXEMPLO } from 'src/modules/financeiro/constants/lancamentos-exemplo';
import { type ClienteRest } from 'src/modules/financeiro/types/cliente-rest';
import { deslocarMes } from 'src/modules/financeiro/utils/deslocar-mes.util';
import { existeLancamentoComChave } from 'src/modules/financeiro/utils/existe-lancamento-com-chave.util';
import { extrairRegistroResposta } from 'src/modules/financeiro/utils/extrair-registro-resposta.util';
import { listarRegistros } from 'src/modules/financeiro/utils/listar-registros.util';
import { reaisParaMicros } from 'src/modules/financeiro/utils/reais-para-micros.util';

// Cria categorias padrão (por nome) e lançamentos de exemplo (por chave). Idempotente.
export const semearFinanceiro = async (
  cliente: ClienteRest,
  hoje: string,
): Promise<{ categoriasCriadas: number; lancamentosCriados: number }> => {
  const existentes = await listarRegistros(cliente, 'categoriasFinanceiras');
  const idPorNome = new Map<string, string>();

  for (const categoria of existentes) {
    if (typeof categoria.nome === 'string') {
      idPorNome.set(categoria.nome, categoria.id);
    }
  }

  let categoriasCriadas = 0;

  for (const categoria of CATEGORIAS_PADRAO) {
    if (idPorNome.has(categoria.nome)) {
      continue;
    }

    const criada = extrairRegistroResposta(
      await cliente.post('/rest/categoriasFinanceiras', {
        nome: categoria.nome,
        tipo: categoria.tipo,
        cor: categoria.cor,
        orcamentoMensal: {
          amountMicros: reaisParaMicros(categoria.orcamentoMensal),
          currencyCode: 'BRL',
        },
      }),
    );

    categoriasCriadas += 1;

    if (criada) {
      idPorNome.set(categoria.nome, criada.id);
    }
  }

  let lancamentosCriados = 0;
  const mesAtual = hoje.slice(0, 7);

  for (const exemplo of LANCAMENTOS_EXEMPLO) {
    if (await existeLancamentoComChave(cliente, exemplo.chave)) {
      continue;
    }

    const data = `${deslocarMes(mesAtual, exemplo.mes)}-${String(exemplo.dia).padStart(2, '0')}`;

    await cliente.post('/rest/lancamentos', {
      descricao: exemplo.descricao,
      tipo: exemplo.tipo,
      valor: { amountMicros: reaisParaMicros(exemplo.valor), currencyCode: 'BRL' },
      data,
      vencimento: data,
      status: exemplo.status,
      recorrencia: exemplo.recorrencia,
      formaPagamento: exemplo.formaPagamento,
      centroCusto: exemplo.centroCusto,
      origem: 'MANUAL',
      chaveIdempotencia: exemplo.chave,
      categoriaId: idPorNome.get(exemplo.categoria) ?? null,
    });

    lancamentosCriados += 1;
  }

  return { categoriasCriadas, lancamentosCriados };
};

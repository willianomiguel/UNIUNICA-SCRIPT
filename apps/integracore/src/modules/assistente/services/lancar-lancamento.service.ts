import { type EntradaLancar } from 'src/modules/assistente/types/entrada-lancar';
import { type ResultadoLancar } from 'src/modules/assistente/types/resultado-lancar';
import { encontrarCategoria } from 'src/modules/assistente/utils/encontrar-categoria.util';
import { formatarDataBr } from 'src/modules/assistente/utils/formatar-data-br.util';
import { montarPayloadLancamento } from 'src/modules/assistente/utils/montar-payload-lancamento.util';
import { type ClienteRest } from 'src/modules/financeiro/types/cliente-rest';
import { extrairRegistroResposta } from 'src/modules/financeiro/utils/extrair-registro-resposta.util';
import { formatarBrl } from 'src/modules/financeiro/utils/formatar-brl.util';
import { listarRegistros } from 'src/modules/financeiro/utils/listar-registros.util';
import { normalizarCategoria } from 'src/modules/financeiro/utils/normalizar-categoria.util';

// Cria o lançamento. Categoria informada que não existe: não grava nada e devolve a lista
// de categorias para o assistente perguntar ao usuário.
export const lancarLancamento = async (
  cliente: ClienteRest,
  entrada: EntradaLancar,
): Promise<ResultadoLancar> => {
  let categoriaId: string | null = null;
  let categoriaNome: string | null = null;

  if (entrada.categoria !== null) {
    const categorias = (await listarRegistros(cliente, 'categoriasFinanceiras')).map(normalizarCategoria);
    const encontrada = encontrarCategoria(categorias, entrada.categoria);

    if (encontrada === null) {
      return {
        ok: false,
        erro: `Categoria "${entrada.categoria}" não existe. Pergunte ao usuário qual usar (ou lance sem categoria).`,
        categoriasDisponiveis: categorias.map((categoria) => categoria.nome),
      };
    }

    categoriaId = encontrada.id;
    categoriaNome = encontrada.nome;
  }

  const resposta = await cliente.post('/rest/lancamentos', montarPayloadLancamento(entrada, categoriaId));
  const criado = extrairRegistroResposta(resposta);

  if (criado === null) {
    return { ok: false, erro: 'O IntegraCore não devolveu o lançamento criado; confira em Lançamentos antes de tentar de novo.' };
  }

  const valor = entrada.valorCentavos / 100;
  const rotuloTipo = entrada.tipo === 'ENTRADA' ? 'Receita' : 'Despesa';

  return {
    ok: true,
    mensagem: `${rotuloTipo} lançada: "${entrada.descricao}", ${formatarBrl(valor)}, ${formatarDataBr(entrada.data)}, status ${entrada.status}${categoriaNome ? `, categoria ${categoriaNome}` : ', sem categoria'}.`,
    id: criado.id,
    valor,
    tipo: entrada.tipo,
    status: entrada.status,
    data: entrada.data,
    categoria: categoriaNome,
  };
};

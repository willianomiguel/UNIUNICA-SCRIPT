import { type CategoriaResumo } from 'src/modules/financeiro/types/categoria-resumo';
import { type DreSimplificada } from 'src/modules/financeiro/types/dre-simplificada';
import { type LancamentoResumo } from 'src/modules/financeiro/types/lancamento-resumo';
import { type LinhaValor } from 'src/modules/financeiro/types/linha-valor';
import { mesDoLancamento } from 'src/modules/financeiro/utils/mes-do-lancamento.util';

const SEM_CATEGORIA = 'Sem categoria';
const SEM_CENTRO_CUSTO = 'Sem centro de custo';

const NOMES_CENTRO_CUSTO: Record<string, string> = {
  DEV: 'Desenvolvimento',
  MARKETING: 'Marketing',
  ESTRATEGIA: 'Estratégia',
  ADMINISTRATIVO: 'Administrativo',
  OUTRO: 'Outro',
};

const arredondar = (valor: number): number => Math.round(valor * 100) / 100;

const somarEm = (
  linhas: Map<string, LinhaValor>,
  chave: string,
  nome: string,
  valor: number,
) => {
  const linha = linhas.get(chave) ?? { chave, nome, valor: 0 };

  linha.valor += valor;
  linhas.set(chave, linha);
};

const ordenarLinhas = (linhas: Map<string, LinhaValor>): LinhaValor[] =>
  [...linhas.values()]
    .map((linha) => ({ ...linha, valor: arredondar(linha.valor) }))
    .sort((a, b) => b.valor - a.valor);

// DRE simplificada (regime de competência) de um mês YYYY-MM, sem cancelados.
export const calcularDreSimplificada = (
  lancamentos: LancamentoResumo[],
  categorias: CategoriaResumo[],
  mes: string,
): DreSimplificada => {
  const nomesCategoria = new Map(
    categorias.map((categoria) => [categoria.id, categoria.nome]),
  );
  const receitas = new Map<string, LinhaValor>();
  const custosCategoria = new Map<string, LinhaValor>();
  const custosCentro = new Map<string, LinhaValor>();
  let receita = 0;
  let custos = 0;

  for (const lancamento of lancamentos) {
    if (lancamento.status === 'CANCELADO' || mesDoLancamento(lancamento) !== mes) {
      continue;
    }

    const chaveCategoria = lancamento.categoriaId ?? 'SEM_CATEGORIA';
    const nomeCategoria =
      (lancamento.categoriaId && nomesCategoria.get(lancamento.categoriaId)) ||
      SEM_CATEGORIA;

    if (lancamento.tipo === 'ENTRADA') {
      receita += lancamento.valor;
      somarEm(receitas, chaveCategoria, nomeCategoria, lancamento.valor);
      continue;
    }

    custos += lancamento.valor;
    somarEm(custosCategoria, chaveCategoria, nomeCategoria, lancamento.valor);

    const chaveCentro = lancamento.centroCusto ?? 'SEM_CENTRO_CUSTO';

    somarEm(
      custosCentro,
      chaveCentro,
      NOMES_CENTRO_CUSTO[chaveCentro] ?? SEM_CENTRO_CUSTO,
      lancamento.valor,
    );
  }

  const resultado = receita - custos;

  return {
    mes,
    receita: arredondar(receita),
    receitasPorCategoria: ordenarLinhas(receitas),
    custos: arredondar(custos),
    custosPorCategoria: ordenarLinhas(custosCategoria),
    custosPorCentroCusto: ordenarLinhas(custosCentro),
    resultado: arredondar(resultado),
    margem: receita > 0 ? arredondar((resultado / receita) * 100) : null,
  };
};

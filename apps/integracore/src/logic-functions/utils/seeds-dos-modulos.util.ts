import seedFinanceiro from 'src/modules/financeiro/seed/seed-financeiro';

// Só dados estruturais (que o app precisa para funcionar), nunca exemplos:
// hoje, as categorias financeiras padrão ("Receita de vendas" é usada pelas vendas).
export const SEEDS_DOS_MODULOS = [{ modulo: 'financeiro', executar: seedFinanceiro }];

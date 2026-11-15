import seedAvisos from 'src/modules/avisos/seed/seed-avisos';
import seedDocs from 'src/modules/docs/seed/seed-docs';
import seedFinanceiro from 'src/modules/financeiro/seed/seed-financeiro';
import seedMetas from 'src/modules/metas/seed/seed-metas';
import seedProjetos from 'src/modules/projetos/seed/seed-projetos';
import seedSprints from 'src/modules/sprints/seed/seed-sprints';
import seedTrafego from 'src/modules/trafego/seed/seed-trafego';
import seedVendas from 'src/modules/vendas/seed/seed-vendas';

// Ordem importa: financeiro antes de vendas (categorias), vendas e tráfego antes de metas,
// projetos antes de sprints e docs (relações com projeto).
export const SEEDS_DOS_MODULOS = [
  { modulo: 'financeiro', executar: seedFinanceiro },
  { modulo: 'vendas', executar: seedVendas },
  { modulo: 'trafego', executar: seedTrafego },
  { modulo: 'metas', executar: seedMetas },
  { modulo: 'projetos', executar: seedProjetos },
  { modulo: 'sprints', executar: seedSprints },
  { modulo: 'docs', executar: seedDocs },
  { modulo: 'avisos', executar: seedAvisos },
];

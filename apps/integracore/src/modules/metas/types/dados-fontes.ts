import { type RegistroIntegraCore } from 'src/modules/financeiro/types/registro-integracore';

// Registros crus das fontes automáticas. `null` = objeto indisponível
// (módulo ainda não instalado ou sem permissão).
export type DadosFontes = {
  vendas: RegistroIntegraCore[] | null;
  lancamentos: RegistroIntegraCore[] | null;
  metricasTrafego: RegistroIntegraCore[] | null;
};

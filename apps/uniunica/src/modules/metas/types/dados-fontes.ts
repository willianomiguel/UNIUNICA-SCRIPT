import { type RegistroTwenty } from 'src/modules/financeiro/types/registro-twenty';

// Registros crus das fontes automáticas. `null` = objeto indisponível
// (módulo ainda não instalado ou sem permissão).
export type DadosFontes = {
  vendas: RegistroTwenty[] | null;
  lancamentos: RegistroTwenty[] | null;
  metricasTrafego: RegistroTwenty[] | null;
};

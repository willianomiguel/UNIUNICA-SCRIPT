import { type FormatoImportacao } from 'src/modules/vendas/types/formato-importacao';

const FORMATOS: FormatoImportacao[] = ['generico', 'stripe', 'mercado_pago', 'asaas', 'pagarme'];

export const lerFormatoImportacao = (
  valor: string | undefined,
): FormatoImportacao | null => {
  const formato = (valor ?? 'generico').trim().toLowerCase().replace('-', '_');

  return FORMATOS.find((opcao) => opcao === formato) ?? null;
};

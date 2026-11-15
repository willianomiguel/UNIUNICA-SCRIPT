import { type ObjetoJson } from 'src/modules/vendas/types/objeto-json';

export const ehObjetoJson = (valor: unknown): valor is ObjetoJson =>
  typeof valor === 'object' && valor !== null && !Array.isArray(valor);

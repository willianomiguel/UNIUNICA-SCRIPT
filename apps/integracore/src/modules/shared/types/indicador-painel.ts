import { type ReactNode } from 'react';

// Um número exibido no topo de um painel (principal ou secundário).
export type IndicadorPainel = {
  titulo: string;
  valor: string;
  detalhe?: ReactNode;
  tom?: 'positivo' | 'negativo' | 'neutro';
};

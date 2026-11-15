export type AlertaRunResult = {
  id: string;
  nome: string;
  status: 'ENVIADO' | 'IGNORADO' | 'FALHOU';
  valor?: number;
  motivo?: string;
  erro?: string;
};

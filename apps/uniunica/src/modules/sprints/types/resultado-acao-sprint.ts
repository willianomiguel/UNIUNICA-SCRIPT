export type ResultadoAcaoSprint = {
  id: string;
  status: 'OK' | 'IGNORADA' | 'NAO_ENCONTRADA' | 'FALHOU';
  mensagem: string;
};

// Valor de concluidaEm depois de uma mudança de status:
// - string: gravar essa data/hora
// - null: limpar (a tarefa saiu de DONE)
// - undefined: não mexer
export const decidirConcluidaEm = ({
  statusAntes,
  statusDepois,
  concluidaEmAtual,
  agora,
}: {
  statusAntes: string | null | undefined;
  statusDepois: string | null | undefined;
  concluidaEmAtual: string | null | undefined;
  agora: Date;
}): string | null | undefined => {
  if (statusDepois === 'DONE') {
    return concluidaEmAtual ? undefined : agora.toISOString();
  }

  if (statusAntes === 'DONE' && concluidaEmAtual) {
    return null;
  }

  return undefined;
};

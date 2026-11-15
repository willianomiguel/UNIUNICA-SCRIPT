// Texto do aviso (snackbar) depois de iniciar/encerrar sprints.
export const formatarMensagemAcaoSprint = (
  verbo: 'iniciada' | 'encerrada',
  resumo: { sucesso: number; ignoradas: number; falhas: number; mensagens?: string[] },
): string => {
  const partes: string[] = [];

  if (resumo.sucesso > 0) {
    partes.push(
      resumo.sucesso === 1
        ? `Sprint ${verbo}`
        : `${resumo.sucesso} sprints ${verbo}s`,
    );
  }

  if (resumo.ignoradas > 0) {
    partes.push(
      `${resumo.ignoradas} ignorada${resumo.ignoradas > 1 ? 's' : ''}`,
    );
  }

  if (resumo.falhas > 0) {
    partes.push(`${resumo.falhas} com erro`);
  }

  const detalhe = (resumo.mensagens ?? []).filter(Boolean).join(' ');
  const base = partes.length > 0 ? partes.join(', ') : 'Nada a fazer';

  return detalhe ? `${base}. ${detalhe}` : base;
};

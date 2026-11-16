// 45 -> "45,0%" (recebe o valor já em percentual, 0 a 100 ou mais).
export const formatarPercentualPontos = (percentual: number): string =>
  `${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(percentual)}%`;

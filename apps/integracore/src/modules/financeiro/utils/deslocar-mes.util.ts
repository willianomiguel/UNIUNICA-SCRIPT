// Soma `quantidade` meses (pode ser negativa) a um mês YYYY-MM.
export const deslocarMes = (mes: string, quantidade: number): string => {
  const [ano, mesNumero] = mes.split('-').map(Number);
  const total = ano * 12 + (mesNumero - 1) + quantidade;

  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, '0')}`;
};

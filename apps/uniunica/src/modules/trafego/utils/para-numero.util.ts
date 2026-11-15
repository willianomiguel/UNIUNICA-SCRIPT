// Converte números vindos de JSON/APIs ("1234.5", "1.234,56", 12) em number; inválido vira 0.
export const paraNumero = (valor: unknown): number => {
  if (typeof valor === 'number') {
    return Number.isFinite(valor) ? valor : 0;
  }

  if (typeof valor !== 'string') {
    return 0;
  }

  let texto = valor.trim().replace(/^R\$\s*/i, '').replace(/\s/g, '');

  if (texto === '') {
    return 0;
  }

  if (texto.includes(',')) {
    texto = texto.replace(/\./g, '').replace(',', '.');
  }

  const numero = Number(texto);

  return Number.isFinite(numero) ? numero : 0;
};

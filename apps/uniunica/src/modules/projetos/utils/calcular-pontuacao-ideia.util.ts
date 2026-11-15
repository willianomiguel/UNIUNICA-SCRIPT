const clampScale = (value: number | null | undefined, fallback: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(5, Math.max(1, Math.round(value)));
};

// Pontuação de uma ideia = impacto × (1 + votos) ÷ esforço, com 1 casa decimal.
// Impacto e esforço vão de 1 a 5 (vazio = 3, fora da faixa é limitado); votos vazios ou
// negativos contam 0. Assim, cada voto multiplica o impacto e o esforço divide o resultado:
// ideia de impacto 5, esforço 1 e 2 votos = 15; impacto 2, esforço 4, 0 votos = 0,5.
export const calcularPontuacaoIdeia = ({
  impacto,
  esforco,
  votos,
}: {
  impacto?: number | null;
  esforco?: number | null;
  votos?: number | null;
}): number => {
  const impactoNormalizado = clampScale(impacto, 3);
  const esforcoNormalizado = clampScale(esforco, 3);
  const votosNormalizados =
    typeof votos === 'number' && Number.isFinite(votos) ? Math.max(0, Math.floor(votos)) : 0;

  const pontuacao = (impactoNormalizado * (1 + votosNormalizados)) / esforcoNormalizado;

  return Math.round(pontuacao * 10) / 10;
};

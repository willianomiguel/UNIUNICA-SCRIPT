export const LIMITES_QUADRO = {
  // Acima disso a tela avisa que o quadro está pesado.
  elementosAviso: 2000,
  // Rejeitado na leitura/gravação para não travar a tela nem o banco.
  elementosMaximo: 10000,
  textoMaximo: 500,
  pontosPorTraco: 2000,
  // Teto do JSON gravado (caracteres): protege o banco e o navegador de quem abre o quadro.
  bytesMaximo: 2_000_000,
  coordenadaMaxima: 1_000_000,
  tamanhoMinimo: 8,
  zoomMinimo: 0.1,
  zoomMaximo: 4,
} as const;

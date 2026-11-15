import { describe, expect, it } from 'vitest';

import { createHmac } from 'crypto';

import { verificarAssinaturaGithub } from 'src/modules/sprints/utils/verificar-assinatura-github.util';

const assinar = (corpo: string, segredo: string) =>
  `sha256=${createHmac('sha256', segredo).update(corpo).digest('hex')}`;

describe('verificarAssinaturaGithub', () => {
  const corpo = '{"action":"opened"}';
  const segredo = 'segredo-de-teste';

  it('aceita assinatura correta', () => {
    expect(
      verificarAssinaturaGithub({
        corpoBruto: corpo,
        assinatura: assinar(corpo, segredo),
        segredo,
      }),
    ).toBe(true);
  });

  it('rejeita assinatura de outro segredo ou corpo alterado', () => {
    expect(
      verificarAssinaturaGithub({
        corpoBruto: corpo,
        assinatura: assinar(corpo, 'outro'),
        segredo,
      }),
    ).toBe(false);
    expect(
      verificarAssinaturaGithub({
        corpoBruto: `${corpo} `,
        assinatura: assinar(corpo, segredo),
        segredo,
      }),
    ).toBe(false);
  });

  it('rejeita quando falta segredo, assinatura ou corpo', () => {
    expect(
      verificarAssinaturaGithub({ corpoBruto: corpo, assinatura: 'x', segredo: '' }),
    ).toBe(false);
    expect(
      verificarAssinaturaGithub({ corpoBruto: corpo, assinatura: undefined, segredo }),
    ).toBe(false);
    expect(
      verificarAssinaturaGithub({
        corpoBruto: undefined,
        assinatura: assinar(corpo, segredo),
        segredo,
      }),
    ).toBe(false);
    expect(
      verificarAssinaturaGithub({ corpoBruto: corpo, assinatura: 'sha256=abc', segredo }),
    ).toBe(false);
  });
});

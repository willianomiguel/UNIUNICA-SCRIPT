import { describe, expect, it } from 'vitest';

import { renderAlertaMessage } from 'src/modules/avisos/utils/render-alerta-message.util';
import { buildAlertaRule } from 'src/modules/avisos/utils/__tests__/alerta-rule.fixture';

describe('renderAlertaMessage', () => {
  it('substitui as variáveis do modelo', () => {
    const rule = buildAlertaRule({ mensagem: '{nome}: {valor} > {limite} em {janela} ({metrica}, {operador})' });

    expect(renderAlertaMessage(rule, 2)).toBe(
      'Chargeback alto: 2,00% > 1,00% em 30 dias (Taxa de chargeback, acima de)',
    );
  });

  it('usa a mensagem padrão quando vazia e mantém variáveis desconhecidas', () => {
    expect(renderAlertaMessage(buildAlertaRule(), 2)).toContain('Chargeback alto');
    expect(renderAlertaMessage(buildAlertaRule({ mensagem: 'x {desconhecida}' }), 2)).toBe('x {desconhecida}');
  });

  it('janela no singular e limite vazio', () => {
    const rule = buildAlertaRule({ mensagem: '{janela} {limite}', janelaDias: 1, limite: null });

    expect(renderAlertaMessage(rule, 0)).toBe('1 dia —');
  });
});

import { describe, expect, it } from 'vitest';

import { parseAlertaRule } from 'src/modules/avisos/utils/parse-alerta-rule.util';

describe('parseAlertaRule', () => {
  it('normaliza um registro REST', () => {
    expect(
      parseAlertaRule({
        id: 'a',
        nome: ' Regra ',
        ativo: true,
        metrica: 'VENDAS_DIA',
        operador: 'MENOR_QUE',
        limite: '10',
        janelaDias: 7,
        canal: 'DISCORD',
        destino: ' https://discord.com/api/webhooks/1/x ',
        mensagem: 'oi',
        cooldownHoras: 6,
        ultimoDisparo: '2026-11-01T00:00:00Z',
      }),
    ).toEqual({
      id: 'a',
      nome: 'Regra',
      ativo: true,
      metrica: 'VENDAS_DIA',
      operador: 'MENOR_QUE',
      limite: 10,
      janelaDias: 7,
      canal: 'DISCORD',
      destino: 'https://discord.com/api/webhooks/1/x',
      mensagem: 'oi',
      cooldownHoras: 6,
      ultimoDisparo: '2026-11-01T00:00:00Z',
    });
  });

  it('aplica padrões seguros para valores ausentes ou inválidos', () => {
    expect(parseAlertaRule({ id: 'b', metrica: 'XPTO', canal: 'EMAIL', limite: null, janelaDias: 0 })).toMatchObject({
      nome: 'Alerta sem nome',
      ativo: false,
      metrica: null,
      operador: 'MAIOR_QUE',
      limite: null,
      janelaDias: 1,
      canal: null,
      destino: '',
      cooldownHoras: 0,
      ultimoDisparo: null,
    });
  });

  it('retorna null sem id', () => {
    expect(parseAlertaRule({ nome: 'x' })).toBeNull();
  });
});

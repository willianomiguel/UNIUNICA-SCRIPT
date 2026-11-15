import { describe, expect, it } from 'vitest';

import { encontrarCampanhaPorReferencia } from 'src/modules/trafego/utils/encontrar-campanha-por-referencia.util';

const campanhas = [
  { id: 'c1', nome: 'Black Friday', plataforma: null, status: null, utmCampaign: 'bf', idExterno: '111' },
  { id: 'c2', nome: 'Marca', plataforma: null, status: null, utmCampaign: 'marca', idExterno: '222' },
];

describe('encontrarCampanhaPorReferencia', () => {
  it('procura por id, idExterno, utm e nome', () => {
    expect(encontrarCampanhaPorReferencia(campanhas, { id: 'c2' })?.id).toBe('c2');
    expect(encontrarCampanhaPorReferencia(campanhas, { idExterno: '111' })?.id).toBe('c1');
    expect(encontrarCampanhaPorReferencia(campanhas, { utmCampaign: 'MARCA' })?.id).toBe('c2');
    expect(encontrarCampanhaPorReferencia(campanhas, { nome: 'black friday' })?.id).toBe('c1');
  });
  it('id tem prioridade sobre os demais', () => {
    expect(encontrarCampanhaPorReferencia(campanhas, { id: 'c1', idExterno: '222' })?.id).toBe('c1');
  });
  it('sem referência ou sem correspondência devolve null', () => {
    expect(encontrarCampanhaPorReferencia(campanhas, null)).toBeNull();
    expect(encontrarCampanhaPorReferencia(campanhas, { idExterno: '999' })).toBeNull();
  });
});

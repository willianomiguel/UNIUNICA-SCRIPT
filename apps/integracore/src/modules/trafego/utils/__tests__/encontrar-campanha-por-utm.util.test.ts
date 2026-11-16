import { describe, expect, it } from 'vitest';

import { encontrarCampanhaPorUtm } from 'src/modules/trafego/utils/encontrar-campanha-por-utm.util';

const campanhas = [
  { id: 'c1', nome: 'BF', plataforma: null, status: null, utmCampaign: 'Black-Friday', idExterno: null },
  { id: 'c2', nome: 'Sem UTM', plataforma: null, status: null, utmCampaign: null, idExterno: null },
];

describe('encontrarCampanhaPorUtm', () => {
  it('encontra ignorando maiúsculas', () => {
    expect(encontrarCampanhaPorUtm(campanhas, 'black-friday')?.id).toBe('c1');
  });
  it('sem correspondência ou utm vazio devolve null', () => {
    expect(encontrarCampanhaPorUtm(campanhas, 'outra')).toBeNull();
    expect(encontrarCampanhaPorUtm(campanhas, null)).toBeNull();
    expect(encontrarCampanhaPorUtm(campanhas, '')).toBeNull();
  });
});

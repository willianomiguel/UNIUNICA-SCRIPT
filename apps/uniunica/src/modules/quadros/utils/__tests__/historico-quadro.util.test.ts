import { describe, expect, it } from 'vitest';

import { type ElementoQuadro } from 'src/modules/quadros/types/elemento-quadro';
import {
  criarHistorico,
  desfazer,
  LIMITE_HISTORICO,
  refazer,
  registrarNoHistorico,
} from 'src/modules/quadros/utils/historico-quadro.util';

const versao = (id: string): ElementoQuadro[] => [
  { id, tipo: 'texto', x: 0, y: 0, largura: 1, altura: 1, cor: 'gray', z: 1, texto: id },
];

describe('historico-quadro', () => {
  it('desfaz e refaz na ordem certa', () => {
    const a = versao('a');
    const b = versao('b');
    const c = versao('c');
    let historico = registrarNoHistorico(registrarNoHistorico(criarHistorico(a), b), c);

    historico = desfazer(historico);
    expect(historico.presente).toBe(b);
    historico = desfazer(historico);
    expect(historico.presente).toBe(a);
    expect(desfazer(historico)).toBe(historico);
    historico = refazer(historico);
    expect(historico.presente).toBe(b);
  });

  it('editar depois de desfazer descarta o refazer', () => {
    const historico = registrarNoHistorico(desfazer(registrarNoHistorico(criarHistorico(versao('a')), versao('b'))), versao('c'));

    expect(historico.futuro).toEqual([]);
    expect(refazer(historico)).toBe(historico);
  });

  it('guarda no máximo o limite de versões', () => {
    let historico = criarHistorico(versao('0'));

    for (let indice = 1; indice <= LIMITE_HISTORICO + 20; indice++) {
      historico = registrarNoHistorico(historico, versao(String(indice)));
    }

    expect(historico.passado).toHaveLength(LIMITE_HISTORICO);
  });
});

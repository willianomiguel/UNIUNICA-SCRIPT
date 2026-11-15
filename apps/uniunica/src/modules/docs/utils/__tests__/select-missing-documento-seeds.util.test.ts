import { describe, expect, it } from 'vitest';

import { DOCS_SEED_DOCUMENTS } from 'src/modules/docs/constants/docs-seed-documents';
import { selectMissingDocumentoSeeds } from 'src/modules/docs/utils/select-missing-documento-seeds.util';

describe('selectMissingDocumentoSeeds', () => {
  it('retorna todos quando nada existe', () => {
    expect(selectMissingDocumentoSeeds(DOCS_SEED_DOCUMENTS, [])).toHaveLength(5);
  });

  it('é idempotente: depois de criar tudo, não sobra nada', () => {
    const titles = DOCS_SEED_DOCUMENTS.map((seed) => seed.titulo);

    expect(selectMissingDocumentoSeeds(DOCS_SEED_DOCUMENTS, titles)).toEqual([]);
  });

  it('ignora acento e caixa ao comparar títulos', () => {
    const result = selectMissingDocumentoSeeds(DOCS_SEED_DOCUMENTS, ['bem-vindo a uniunica']);

    expect(result.map((seed) => seed.titulo)).not.toContain('Bem-vindo à UniÚnica');
    expect(result).toHaveLength(4);
  });

  it('o documento de boas-vindas cita todos os módulos do menu', () => {
    const welcome = DOCS_SEED_DOCUMENTS[0].markdown;

    for (const modulo of ['Projetos', 'Sprints', 'Vendas', 'Financeiro', 'Metas', 'Tráfego', 'Wiki', 'Avisos']) {
      expect(welcome).toContain(`## ${modulo}`);
    }
  });
});

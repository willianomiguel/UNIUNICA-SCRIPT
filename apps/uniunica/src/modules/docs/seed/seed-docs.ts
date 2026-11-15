import { RestApiClient } from 'twenty-client-sdk/rest';

import { DOCS_SEED_DOCUMENTS } from 'src/modules/docs/constants/docs-seed-documents';
import { parseWikiDocuments } from 'src/modules/docs/utils/parse-wiki-documents.util';
import { selectMissingDocumentoSeeds } from 'src/modules/docs/utils/select-missing-documento-seeds.util';

// Idempotente: cria só os documentos iniciais cujo título ainda não existe.
const seedDocs = async (): Promise<void> => {
  const client = new RestApiClient();
  const existing = parseWikiDocuments(
    await client.get('/rest/documentos', { query: { limit: 200, depth: 0 } }),
  );
  const missing = selectMissingDocumentoSeeds(
    DOCS_SEED_DOCUMENTS,
    existing.map((document) => document.titulo),
  );

  for (const seed of missing) {
    await client.post('/rest/documentos', {
      titulo: seed.titulo,
      categoria: seed.categoria,
      status: seed.status,
      fixado: seed.fixado,
      ordem: seed.ordem,
      conteudo: { markdown: seed.markdown, blocknote: null },
    });
  }
};

export default seedDocs;

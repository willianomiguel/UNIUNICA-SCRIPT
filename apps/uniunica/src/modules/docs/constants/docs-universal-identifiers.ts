import { OBJECTS } from 'src/modules/shared/constants/objects';

// IDs estáveis do módulo docs. Nunca altere depois do primeiro sync.
export const DOCS_UNIVERSAL_IDENTIFIERS = {
  object: OBJECTS.documento.universalIdentifier,
  fields: {
    titulo: 'c6e02a66-a76b-4d44-bc88-af2cb319086b',
    conteudo: '6a7ce98b-8b66-4784-bc09-c481b2f19ded',
    categoria: 'c412b806-ae36-4619-9362-96a34631f6d5',
    status: '46816880-d58c-48b8-acea-66600d497b1e',
    fixado: '720f2d36-1ea3-4dd1-bc8f-5d20a3867ead',
    ordem: 'd606fbe2-625a-4d73-98cf-c42c51ed8815',
    documentoPai: 'f71cf32b-fe7c-49b3-a25c-04ea14a0d81f',
    subdocumentos: '489d8ed4-8df7-423e-b6f4-bcb9c0c20213',
    projetoOnDocumento: '5e84a46d-05f9-4828-92d6-8e6f99b27c76',
    documentosOnProjeto: '030854b1-24c1-4600-97b0-f218d1992bb2',
  },
  views: {
    todos: 'eca73e81-efcb-45cd-be77-9367e92f348c',
    porCategoria: '2e3eefcc-03e5-45bf-aff8-5ce7f7fdecdf',
    fixados: '48cb75ac-3f72-4b14-8564-33ebd97f1ac8',
    recordPageFields: '58305598-968e-4487-9bde-2ca713ff1403',
  },
  wiki: {
    frontComponent: 'f8453ed2-df63-460c-b08d-3691f79c4ef1',
    pageLayout: 'e80fad7f-45fe-4231-b8ba-511348a3960c',
    pageLayoutTab: '690e96ae-1e38-41c8-ba9e-208d91788c48',
    widget: '09fcd936-f311-478f-b474-cfd70769472c',
    navigationMenuItem: '34b2120b-66ba-4741-b201-05178e06ac6d',
  },
  documentosNavigationMenuItem: '1963cca2-41ae-4fbc-a8b0-0e8eaf947b96',
} as const;

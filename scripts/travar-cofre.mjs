#!/usr/bin/env node
// Tira o Cofre de acessos de TODAS as funções editáveis do workspace, menos "Membro com cofre".
// (Admin e os papéis do app não são editáveis; o papel do app precisa ler o bloco cifrado para a tela funcionar.)
// Idempotente: rode depois de cada instalação/atualização e sempre que criar uma função nova.
// Uso: SERVER_URL=https://gestao.dominio.com.br node scripts/travar-cofre.mjs < ~/.uniunica-api-key
// A chave (papel Admin) vem pelo stdin para não ficar no histórico do shell.
import { readFileSync } from 'node:fs';

const SERVER_URL = (process.env.SERVER_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const CHAVE = readFileSync(0, 'utf8').trim();
// Mesmo ID de apps/uniunica/src/modules/shared/constants/objects.ts (OBJECTS.cofre).
const COFRE_UNIVERSAL_IDENTIFIER = '8d61259b-fd4d-43e0-91c2-7855b2537d41';
const FUNCAO_COM_COFRE = 'a4a55f63-b1b4-4487-a640-68ccbd8a72f0';

if (!CHAVE) {
  console.error('Passe a chave de API (Admin) pelo stdin.');
  process.exit(1);
}

const url = new URL(SERVER_URL);
const local = ['localhost', '127.0.0.1', 'host.docker.internal'].includes(url.hostname);

if (url.protocol !== 'https:' && !local) {
  console.error('Use https: a chave Admin não pode trafegar sem criptografia.');
  process.exit(1);
}

const graphql = async (query, variables = {}) => {
  const resposta = await fetch(`${SERVER_URL}/metadata`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${CHAVE}`, 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const corpo = await resposta.json();

  if (!resposta.ok || corpo.errors) {
    throw new Error(JSON.stringify(corpo.errors ?? corpo));
  }

  return corpo.data;
};

const { getRoles, objects } = await graphql(`{
  getRoles { id label isEditable universalIdentifier }
  objects(paging: { first: 500 }, filter: {}) { edges { node { id nameSingular universalIdentifier } } }
}`);

const cofre = objects.edges.map((edge) => edge.node).find((objeto) => objeto.nameSingular === 'cofre');

if (!cofre) {
  throw new Error('Objeto "cofre" não encontrado. Rode o apply do app antes.');
}

if (cofre.universalIdentifier !== COFRE_UNIVERSAL_IDENTIFIER) {
  throw new Error(`O objeto "cofre" deste workspace não é o do app (id ${cofre.universalIdentifier ?? 'vazio'}).`);
}

const alvos = getRoles.filter((papel) => papel.isEditable && papel.universalIdentifier !== FUNCAO_COM_COFRE);

for (const papel of alvos) {
  const { upsertObjectPermissions } = await graphql(
    `mutation ($input: UpsertObjectPermissionsInput!) {
      upsertObjectPermissions(upsertObjectPermissionsInput: $input) { objectMetadataId canReadObjectRecords }
    }`,
    {
      input: {
        roleId: papel.id,
        objectPermissions: [
          {
            objectMetadataId: cofre.id,
            canReadObjectRecords: false,
            canUpdateObjectRecords: false,
            canSoftDeleteObjectRecords: false,
            canDestroyObjectRecords: false,
          },
        ],
      },
    },
  );

  const resultado = upsertObjectPermissions.find((permissao) => permissao.objectMetadataId === cofre.id);

  if (resultado?.canReadObjectRecords !== false) {
    throw new Error(`A função "${papel.label}" não ficou travada. Confira em Configurações → Funções.`);
  }

  console.log(`travada: ${papel.label}`);
}

const comCofre = getRoles.filter((papel) => !alvos.includes(papel)).map((papel) => papel.label);

console.log(`OK. Continuam com acesso (não editáveis ou liberadas): ${comCofre.join(', ')}`);

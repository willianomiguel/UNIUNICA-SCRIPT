import { defineObject, FieldType } from 'integra-sdk/define';

import { COFRE_UNIVERSAL_IDENTIFIERS } from 'src/modules/cofre/constants/cofre-universal-identifiers';
import { OBJECTS } from 'src/modules/shared/constants/objects';

const FIELDS = COFRE_UNIVERSAL_IDENTIFIERS.fields;

export default defineObject({
  universalIdentifier: OBJECTS.cofre.universalIdentifier,
  nameSingular: OBJECTS.cofre.nameSingular,
  namePlural: OBJECTS.cofre.namePlural,
  labelSingular: 'Cofre',
  labelPlural: 'Cofres de acessos',
  description:
    'Cofre de acessos (máquinas virtuais, servidores). O conteúdo é criptografado no navegador com a senha do cofre; o servidor só guarda o bloco cifrado.',
  icon: 'IconLock',
  labelIdentifierFieldMetadataUniversalIdentifier: FIELDS.nome,
  fields: [
    {
      universalIdentifier: FIELDS.nome,
      type: FieldType.TEXT,
      name: 'nome',
      label: 'Nome',
      description: 'Nome do cofre (fica visível sem a senha; não coloque dado sensível aqui)',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: FIELDS.conteudoCifrado,
      type: FieldType.TEXT,
      name: 'conteudoCifrado',
      label: 'Conteúdo cifrado',
      description: 'Bloco criptografado. Não edite à mão: use a aba Cofre.',
      icon: 'IconLock',
      isNullable: true,
      // Sem isso a linha do tempo guarda cada bloco antigo, legível por quem não abre o cofre,
      // e trocar a senha não protegeria as versões anteriores.
      isAuditLogged: false,
    },
  ],
});

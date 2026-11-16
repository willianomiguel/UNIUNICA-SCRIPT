import { defineApplicationRole, SystemPermissionFlag } from 'integra-sdk/define';

import {
  APP_DISPLAY_NAME,
  DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineApplicationRole({
  universalIdentifier: DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
  label: `${APP_DISPLAY_NAME} default function role`,
  description: `${APP_DISPLAY_NAME} default function role`,
  canReadAllObjectRecords: true,
  canUpdateAllObjectRecords: true,
  canSoftDeleteAllObjectRecords: true,
  canDestroyAllObjectRecords: false,
  canBeAssignedToUsers: false,
  canBeAssignedToApiKeys: false,
  // AI: a conversa do quadro (quadro-ia-conversar) roda o agente do app com runAgent.
  permissionFlagUniversalIdentifiers: [SystemPermissionFlag.AI],
  // Não negue o objeto cofre aqui: o IntegraCore copia esta função para a "IntegraCore role",
  // que também limita os front components, e a tela do cofre deixaria de abrir para todos.
});

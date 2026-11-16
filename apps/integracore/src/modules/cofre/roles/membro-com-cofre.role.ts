import { defineRole } from 'integra-sdk/define';

import { COFRE_UNIVERSAL_IDENTIFIERS } from 'src/modules/cofre/constants/cofre-universal-identifiers';

// No IntegraCore cada membro tem UMA função. Esta é igual à "Member" padrão e ainda abre o cofre.
// A "Member" perde a leitura do cofre (feito no workspace, ver README do módulo).
export default defineRole({
  universalIdentifier: COFRE_UNIVERSAL_IDENTIFIERS.roleMembroComCofre,
  label: 'Membro com cofre',
  description: 'Mesmas permissões de um membro comum, mais acesso ao Cofre de acessos.',
  icon: 'IconLock',
  canReadAllObjectRecords: true,
  canUpdateAllObjectRecords: true,
  canSoftDeleteAllObjectRecords: true,
  canDestroyAllObjectRecords: true,
  canUpdateAllSettings: false,
  canAccessAllTools: true,
  canAccessAllAgentChatChannels: true,
  canBeAssignedToUsers: true,
  canBeAssignedToAgents: false,
  canBeAssignedToApiKeys: false,
  objectPermissions: [
    {
      objectUniversalIdentifier: COFRE_UNIVERSAL_IDENTIFIERS.object,
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: true,
      // Apagar de vez um cofre perde todos os acessos: só pela lixeira, por admin.
      canDestroyObjectRecords: false,
    },
  ],
});

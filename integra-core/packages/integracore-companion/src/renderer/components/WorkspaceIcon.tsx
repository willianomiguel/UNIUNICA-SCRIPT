import { Avatar } from 'integracore-ui/primitives/data-display';
import { getAvatarInitial } from 'integracore-ui/utilities';
import { type Agenda } from '../../shared/types/Agenda';

export const WorkspaceIcon = ({
  workspace,
}: {
  workspace: Agenda['workspace'] | null;
}) => {
  const workspaceName = workspace?.name ?? 'IntegraCore';

  return (
    <span aria-hidden="true" className="workspace-avatar">
      <Avatar
        src={workspace?.logoUrl || './integracore.svg'}
        name={workspaceName}
        colorSeed={getAvatarInitial(workspaceName)}
        size="lg"
        shape="square"
      />
    </span>
  );
};

import { v4 } from 'uuid';

import { type FlatSkill } from 'src/engine/metadata-modules/flat-skill/types/flat-skill.type';
import { INTEGRA_STANDARD_APPLICATION } from 'src/engine/workspace-manager/integracore-standard-application/constants/integracore-standard-applications';
import { STANDARD_SKILL } from 'src/engine/workspace-manager/integracore-standard-application/constants/standard-skill.constant';
import { type AllStandardSkillName } from 'src/engine/workspace-manager/integracore-standard-application/types/all-standard-skill-name.type';
import { type StandardBuilderArgs } from 'src/engine/workspace-manager/integracore-standard-application/types/metadata-standard-buillder-args.type';

export type CreateStandardSkillContext = {
  skillName: AllStandardSkillName;
  name: string;
  label: string;
  icon: string | null;
  description: string | null;
  content: string;
  isSystem: boolean;
  isActive?: boolean;
};

export type CreateStandardSkillArgs = StandardBuilderArgs<'skill'> & {
  context: CreateStandardSkillContext;
};

export const createStandardSkillFlatMetadata = ({
  context: {
    skillName,
    name,
    label,
    icon,
    description,
    content,
    isSystem,
    isActive = true,
  },
  workspaceId,
  integracoreStandardApplicationId,
  now,
}: CreateStandardSkillArgs): FlatSkill => {
  const universalIdentifier = STANDARD_SKILL[skillName].universalIdentifier;

  return {
    id: v4(),
    universalIdentifier,
    name,
    label,
    icon,
    description,
    content,
    isSystem,
    isActive,
    overrides: null,
    workspaceId,
    applicationId: integracoreStandardApplicationId,
    applicationUniversalIdentifier:
      INTEGRA_STANDARD_APPLICATION.universalIdentifier,
    createdAt: now,
    updatedAt: now,
  };
};

import { type SidePanelPages } from 'integracore-shared/types';

export type CoreAgentSidePanelPage =
  | SidePanelPages.AgentCoreTriggerType
  | SidePanelPages.AgentCoreTrigger
  | SidePanelPages.AgentCoreDataAccess
  | SidePanelPages.AgentCoreTools;

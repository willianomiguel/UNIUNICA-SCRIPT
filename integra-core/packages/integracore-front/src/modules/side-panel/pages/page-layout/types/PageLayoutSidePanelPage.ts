import { type SidePanelPages } from 'integracore-shared/types';

export type PageLayoutSidePanelPage =
  | SidePanelPages.PageLayoutDashboardWidgetTypeSelect
  | SidePanelPages.PageLayoutTabSettings
  | SidePanelPages.PageLayoutWidgetSettings
  | SidePanelPages.DashboardChartSettings
  | SidePanelPages.DashboardIframeSettings
  | SidePanelPages.DashboardRecordTableSettings
  | SidePanelPages.RecordPageFieldsSettings
  | SidePanelPages.RecordPageFieldSettings
  | SidePanelPages.PageLayoutRecordPageWidgetTypeSelect;

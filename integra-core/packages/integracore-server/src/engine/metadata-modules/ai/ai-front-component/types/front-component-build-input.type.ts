import { type PageLayoutType } from 'integracore-shared/types';

export type FrontComponentBuildInput = {
  componentId: string;
  name: string;
  source: string;
  pageLayoutType: PageLayoutType.DASHBOARD | PageLayoutType.RECORD_PAGE;
};

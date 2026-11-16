import { normalizeSearchText } from 'integracore-ui/utilities';

export const isMatchingSidePanelSearch = ({
  label,
  sidePanelSearch,
}: {
  label: string;
  sidePanelSearch: string;
}) =>
  normalizeSearchText(label).includes(
    normalizeSearchText(sidePanelSearch.trim()),
  );

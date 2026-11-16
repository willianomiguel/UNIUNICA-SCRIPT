import { isNonEmptyString } from '@sniptt/guards';
import { isDefined } from 'integracore-shared/utils';
import { type SelectOption } from 'integracore-ui/primitives/input';
import { normalizeSearchText } from 'integracore-ui/utilities';

export const isSelectOptionMatchingSearch = ({
  option: { label, searchKeywords },
  normalizedSearchInputValue,
}: {
  option: Pick<SelectOption, 'label' | 'searchKeywords'>;
  normalizedSearchInputValue: string;
}) => {
  if (!isNonEmptyString(normalizedSearchInputValue)) {
    return true;
  }

  return (
    normalizeSearchText(label).includes(normalizedSearchInputValue) ||
    (isDefined(searchKeywords) &&
      normalizeSearchText(searchKeywords).includes(normalizedSearchInputValue))
  );
};

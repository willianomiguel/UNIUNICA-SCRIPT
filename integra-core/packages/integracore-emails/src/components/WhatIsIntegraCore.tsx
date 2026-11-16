import { type I18n } from '@lingui/core';
import { MainText } from 'src/components/MainText';
import { SubTitle } from 'src/components/SubTitle';

type WhatIsIntegraCoreProps = {
  i18n: I18n;
};

export const WhatIsIntegraCore = ({ i18n }: WhatIsIntegraCoreProps) => {
  return (
    <>
      <SubTitle value={i18n._('What is IntegraCore?')} />
      <MainText>
        {i18n._(
          "It's a CRM, a software to help businesses manage their customer data and relationships efficiently.",
        )}
      </MainText>
    </>
  );
};

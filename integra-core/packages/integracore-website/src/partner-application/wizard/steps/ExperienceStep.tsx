'use client';

import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import { ChipMultiSelect, Field, TextareaField, TextField } from '@/ui';

import { PARTNER_INTEGRA_EXPERIENCE_OPTIONS } from '../../data/partner-integracore-experience-options';
import { PARTNER_APPLICATION_COPY } from '../../partner-application-copy';
import { type PartnerApplicationController } from '../../use-partner-application-state';

const FIELDS = PARTNER_APPLICATION_COPY.fields;

export function ExperienceStep({
  controller,
}: {
  controller: PartnerApplicationController;
}) {
  const { i18n } = useLingui();
  const { setField, state, toggleExperience } = controller;

  const experienceOptions = PARTNER_INTEGRA_EXPERIENCE_OPTIONS.map((option) => ({
    label: i18n._(option.label),
    value: option.value,
  }));

  return (
    <>
      <Field
        hint={i18n._(FIELDS.integracoreExperienceHint)}
        label={i18n._(FIELDS.integracoreExperience)}
      >
        <ChipMultiSelect
          ariaLabel={i18n._(FIELDS.integracoreExperience)}
          invalid={state.fieldErrors.integracoreExperience !== undefined}
          onToggle={toggleExperience}
          options={experienceOptions}
          values={state.integracoreExperience}
        />
      </Field>
      <Field
        hint={i18n._(FIELDS.integracoreExperienceNotesHint)}
        label={i18n._(FIELDS.integracoreExperienceNotes)}
      >
        <TextareaField
          ariaLabel={i18n._(FIELDS.integracoreExperienceNotes)}
          invalid={state.fieldErrors.integracoreExperienceNotes !== undefined}
          name="integracoreExperienceNotes"
          onValueChange={(value) => setField('integracoreExperienceNotes', value)}
          placeholder={i18n._(FIELDS.integracoreExperienceNotesPlaceholder)}
          value={state.integracoreExperienceNotes}
        />
      </Field>
      <Field
        hint={i18n._(FIELDS.integracoreExperienceProofLinkHint)}
        label={i18n._(FIELDS.integracoreExperienceProofLink)}
      >
        <TextField
          ariaLabel={i18n._(FIELDS.integracoreExperienceProofLink)}
          inputMode="url"
          invalid={state.fieldErrors.integracoreExperienceProofLink !== undefined}
          name="integracoreExperienceProofLink"
          onValueChange={(value) =>
            setField('integracoreExperienceProofLink', value)
          }
          placeholder={i18n._(msg`https://`)}
          value={state.integracoreExperienceProofLink}
        />
      </Field>
    </>
  );
}

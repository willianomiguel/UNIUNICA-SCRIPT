import { INITIAL_PARTNER_APPLICATION_STATE } from './partner-application-state';
import { validatePartnerApplicationStep } from './validate-partner-application-step';

const validExperienceNotes =
  'Built a custom IntegraCore app for a property-management client, modeled leases and ' +
  'tenants as data models, automated renewal workflows, and shipped a front component ' +
  'for the broker dashboard with role-based views.';

describe('validatePartnerApplicationStep', () => {
  it('requires experience milestones, narrative, and proof URL on Experience', () => {
    const errors = validatePartnerApplicationStep({
      ...INITIAL_PARTNER_APPLICATION_STATE,
      stepIndex: 3,
    });
    expect(errors.integracoreExperience).toBe('required');
    expect(errors.integracoreExperienceNotes).toBe('required');
    expect(errors.integracoreExperienceProofLink).toBe('required');
  });

  it('rejects a narrative under 200 characters on Experience', () => {
    const errors = validatePartnerApplicationStep({
      ...INITIAL_PARTNER_APPLICATION_STATE,
      stepIndex: 3,
      integracoreExperience: ['WORKFLOWS'],
      integracoreExperienceNotes: 'Too short for a real implementation narrative.',
      integracoreExperienceProofLink: 'https://www.loom.com/share/example',
    });
    expect(errors.integracoreExperienceNotes).toBe('too_short');
  });

  it('rejects an invalid proof URL on Experience', () => {
    const errors = validatePartnerApplicationStep({
      ...INITIAL_PARTNER_APPLICATION_STATE,
      stepIndex: 3,
      integracoreExperience: ['CUSTOM_APPS'],
      integracoreExperienceNotes: validExperienceNotes,
      integracoreExperienceProofLink: 'not-a-url',
    });
    expect(errors.integracoreExperienceProofLink).toBe('invalid_url');
  });

  it('accepts a complete Experience step', () => {
    const errors = validatePartnerApplicationStep({
      ...INITIAL_PARTNER_APPLICATION_STATE,
      stepIndex: 3,
      integracoreExperience: ['CUSTOM_APPS', 'DATA_MODELS'],
      integracoreExperienceNotes: validExperienceNotes,
      integracoreExperienceProofLink: 'https://www.loom.com/share/example',
    });
    expect(errors).toEqual({});
  });
});

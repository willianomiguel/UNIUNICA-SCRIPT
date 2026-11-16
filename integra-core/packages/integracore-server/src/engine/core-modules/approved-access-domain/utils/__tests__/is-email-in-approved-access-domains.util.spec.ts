import { isEmailInApprovedAccessDomains } from 'src/engine/core-modules/approved-access-domain/utils/is-email-in-approved-access-domains.util';

describe('isEmailInApprovedAccessDomains', () => {
  const approvedAccessDomains = [{ domain: 'integracore.com', isValidated: true }];

  it('should deny when email verification is not required, even on a validated domain', () => {
    expect(
      isEmailInApprovedAccessDomains({
        email: 'tata@integracore.com',
        approvedAccessDomains,
        isEmailVerificationRequired: false,
      }),
    ).toBe(false);
  });

  it('should deny when the matching domain is not validated', () => {
    expect(
      isEmailInApprovedAccessDomains({
        email: 'tata@integracore.com',
        approvedAccessDomains: [{ domain: 'integracore.com', isValidated: false }],
        isEmailVerificationRequired: true,
      }),
    ).toBe(false);
  });

  it('should deny when the email domain does not match any approved domain', () => {
    expect(
      isEmailInApprovedAccessDomains({
        email: 'tata@evil.com',
        approvedAccessDomains,
        isEmailVerificationRequired: true,
      }),
    ).toBe(false);
  });
});

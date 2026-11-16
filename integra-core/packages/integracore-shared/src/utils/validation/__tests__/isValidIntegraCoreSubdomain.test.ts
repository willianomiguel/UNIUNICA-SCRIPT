import { isValidIntegraCoreSubdomain } from '@/utils/validation/isValidIntegraCoreSubdomain';

describe('isValidIntegraCoreSubdomain', () => {
  describe('valid subdomains', () => {
    it('should accept standard alphanumeric subdomains', () => {
      expect(isValidIntegraCoreSubdomain('abc')).toBe(true);
      expect(isValidIntegraCoreSubdomain('test123')).toBe(true);
      expect(isValidIntegraCoreSubdomain('company1')).toBe(true);
      expect(isValidIntegraCoreSubdomain('workspace2024')).toBe(true);
    });

    it('should accept subdomains with hyphens in the middle', () => {
      expect(isValidIntegraCoreSubdomain('my-company')).toBe(true);
      expect(isValidIntegraCoreSubdomain('test-workspace')).toBe(true);
      expect(isValidIntegraCoreSubdomain('multi-word-subdomain')).toBe(true);
      expect(isValidIntegraCoreSubdomain('a-b-c-d-e')).toBe(true);
    });

    it('should accept minimum length subdomains (1 character)', () => {
      expect(isValidIntegraCoreSubdomain('a')).toBe(true);
      expect(isValidIntegraCoreSubdomain('1')).toBe(true);
      expect(isValidIntegraCoreSubdomain('ab')).toBe(true);
      expect(isValidIntegraCoreSubdomain('a-b')).toBe(true);
    });

    it('should accept maximum length subdomains (30 characters)', () => {
      const exactly30 = 'a' + 'b'.repeat(28) + 'c';

      expect(exactly30.length).toBe(30);
      expect(isValidIntegraCoreSubdomain(exactly30)).toBe(true);
    });

    it('should accept numeric-only subdomains', () => {
      expect(isValidIntegraCoreSubdomain('123')).toBe(true);
      expect(isValidIntegraCoreSubdomain('456789')).toBe(true);
      expect(isValidIntegraCoreSubdomain('1-2-3')).toBe(true);
    });
  });

  describe('invalid subdomains', () => {
    it('should reject empty strings', () => {
      expect(isValidIntegraCoreSubdomain('')).toBe(false);
    });

    it('should reject subdomains longer than 30 characters', () => {
      const tooLong = 'a'.repeat(31);

      expect(isValidIntegraCoreSubdomain(tooLong)).toBe(false);
    });

    it('should reject subdomains starting with a hyphen', () => {
      expect(isValidIntegraCoreSubdomain('-test')).toBe(false);
      expect(isValidIntegraCoreSubdomain('-abc')).toBe(false);
    });

    it('should reject subdomains ending with a hyphen', () => {
      expect(isValidIntegraCoreSubdomain('test-')).toBe(false);
      expect(isValidIntegraCoreSubdomain('abc-')).toBe(false);
    });

    it('should reject subdomains with uppercase letters', () => {
      expect(isValidIntegraCoreSubdomain('Test')).toBe(false);
      expect(isValidIntegraCoreSubdomain('MyCompany')).toBe(false);
      expect(isValidIntegraCoreSubdomain('WORKSPACE')).toBe(false);
    });

    it('should reject subdomains with special characters', () => {
      expect(isValidIntegraCoreSubdomain('test@company')).toBe(false);
      expect(isValidIntegraCoreSubdomain('my_workspace')).toBe(false);
      expect(isValidIntegraCoreSubdomain('test.company')).toBe(false);
      expect(isValidIntegraCoreSubdomain('workspace#1')).toBe(false);
    });

    it('should reject subdomains with spaces', () => {
      expect(isValidIntegraCoreSubdomain('test company')).toBe(false);
      expect(isValidIntegraCoreSubdomain(' test')).toBe(false);
      expect(isValidIntegraCoreSubdomain('test ')).toBe(false);
    });

    it('should reject subdomains starting with "api-"', () => {
      expect(isValidIntegraCoreSubdomain('api-test')).toBe(false);
      expect(isValidIntegraCoreSubdomain('api-company')).toBe(false);
      expect(isValidIntegraCoreSubdomain('api-123')).toBe(false);
    });

    it('should accept subdomains containing "api" not as prefix', () => {
      expect(isValidIntegraCoreSubdomain('myapi')).toBe(true);
      expect(isValidIntegraCoreSubdomain('rapid')).toBe(true);
    });

    it('should reject subdomains with only hyphens', () => {
      expect(isValidIntegraCoreSubdomain('---')).toBe(false);
      expect(isValidIntegraCoreSubdomain('----')).toBe(false);
    });

    it('should reject whitespace-only strings', () => {
      expect(isValidIntegraCoreSubdomain('   ')).toBe(false);
      expect(isValidIntegraCoreSubdomain('\t')).toBe(false);
      expect(isValidIntegraCoreSubdomain('\n')).toBe(false);
    });

    it('should reject unicode characters', () => {
      expect(isValidIntegraCoreSubdomain('café')).toBe(false);
      expect(isValidIntegraCoreSubdomain('tëst')).toBe(false);
    });
  });
});

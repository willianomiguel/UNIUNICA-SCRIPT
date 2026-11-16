import { getCalEventTypeReference } from '@/getting-started/utils/getCalEventTypeReference';

describe('getCalEventTypeReference', () => {
  it('should read a team event type', () => {
    expect(getCalEventTypeReference('team/integracore/talk-to-us')).toEqual({
      teamSlug: 'integracore',
      eventTypeSlug: 'talk-to-us',
    });
  });

  it('should read a user event type', () => {
    expect(getCalEventTypeReference('jane/intro')).toEqual({
      username: 'jane',
      eventTypeSlug: 'intro',
    });
  });

  it.each(['integracore', 'team/integracore', 'jane/intro/extra', ''])(
    'should reject the malformed booking page id "%s"',
    (calendarBookingPageId) => {
      expect(getCalEventTypeReference(calendarBookingPageId)).toBeNull();
    },
  );
});

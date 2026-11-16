import { getBookCallStepMinEmployeeCount } from 'src/engine/core-modules/onboarding/utils/get-book-call-step-min-employee-count.util';
import { IntegraCoreConfigService } from 'src/engine/core-modules/integracore-config/integracore-config.service';

export const readBookCallStepMinEmployeeCount = (
  integracoreConfigService: IntegraCoreConfigService,
): number | null =>
  getBookCallStepMinEmployeeCount({
    calendarBookingPageId: integracoreConfigService.get('CALENDAR_BOOKING_PAGE_ID'),
    minEmployeeCount: integracoreConfigService.get(
      'ONBOARDING_BOOK_CALL_MIN_EMPLOYEE_COUNT',
    ),
  });

import { RecurrencePattern } from '@/types';

interface CalculateNextDeadlineConfig {
  pattern: RecurrencePattern;
  currentDeadline: string;
  endDate: string | null;
  dayOfWeek: number | null;
  dayOfMonth: number | null;
}

/**
 * Calculate the next deadline for a recurring task
 * @returns ISO date string of next deadline, or null if recurrence has ended
 */
export function calculateNextDeadline(config: CalculateNextDeadlineConfig): string | null {
  const { pattern, currentDeadline, endDate, dayOfWeek, dayOfMonth } = config;

  if (!pattern) return null;

  const current = new Date(currentDeadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let nextDate: Date;

  switch (pattern) {
    case 'daily':
      nextDate = calculateNextDailyDeadline(current, today);
      break;
    case 'weekly':
      nextDate = calculateNextWeeklyDeadline(current, today, dayOfWeek);
      break;
    case 'monthly':
      nextDate = calculateNextMonthlyDeadline(current, today, dayOfMonth);
      break;
    default:
      return null;
  }

  // Check if next date is past the end date
  if (endDate) {
    const end = new Date(endDate);
    if (nextDate > end) {
      return null; // Recurrence has ended
    }
  }

  return nextDate.toISOString();
}

function calculateNextDailyDeadline(current: Date, today: Date): Date {
  // Next day after current deadline
  const next = new Date(current);
  next.setDate(next.getDate() + 1);

  // If next is in the past, start from tomorrow
  if (next <= today) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  return next;
}

function calculateNextWeeklyDeadline(
  current: Date,
  today: Date,
  dayOfWeek: number | null
): Date {
  const targetDay = dayOfWeek ?? current.getDay(); // Default to same day of week

  // Start from current + 7 days (next week)
  const next = new Date(current);
  next.setDate(next.getDate() + 7);

  // Adjust to target day of week if specified
  if (dayOfWeek !== null) {
    const diff = targetDay - next.getDay();
    next.setDate(next.getDate() + diff);
  }

  // If calculated date is in the past, find next occurrence
  if (next <= today) {
    const upcoming = new Date(today);
    const daysUntilTarget = (targetDay - today.getDay() + 7) % 7;
    upcoming.setDate(upcoming.getDate() + (daysUntilTarget === 0 ? 7 : daysUntilTarget));
    return upcoming;
  }

  return next;
}

function calculateNextMonthlyDeadline(
  current: Date,
  today: Date,
  dayOfMonth: number | null
): Date {
  const targetDay = dayOfMonth ?? current.getDate(); // Default to same day of month

  // Start from next month
  const next = new Date(current);
  next.setMonth(next.getMonth() + 1);

  // Handle months with fewer days (e.g., setting day 31 in February)
  const maxDays = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(targetDay, maxDays));

  // If calculated date is in the past, find next occurrence
  if (next <= today) {
    const upcoming = new Date(today);
    // Try this month first
    const maxDaysThisMonth = new Date(
      upcoming.getFullYear(),
      upcoming.getMonth() + 1,
      0
    ).getDate();
    const dayThisMonth = Math.min(targetDay, maxDaysThisMonth);
    upcoming.setDate(dayThisMonth);

    if (upcoming <= today) {
      // Move to next month
      upcoming.setMonth(upcoming.getMonth() + 1);
      const maxDaysNextMonth = new Date(
        upcoming.getFullYear(),
        upcoming.getMonth() + 1,
        0
      ).getDate();
      upcoming.setDate(Math.min(targetDay, maxDaysNextMonth));
    }
    return upcoming;
  }

  return next;
}

/**
 * Get human-readable recurrence description
 */
export function getRecurrenceDescription(
  pattern: RecurrencePattern,
  dayOfWeek: number | null,
  dayOfMonth: number | null,
  endDate: string | null
): string {
  if (!pattern) return '';

  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  let desc = '';
  switch (pattern) {
    case 'daily':
      desc = 'Repeats daily';
      break;
    case 'weekly':
      desc =
        dayOfWeek !== null
          ? `Repeats weekly on ${dayNames[dayOfWeek]}`
          : 'Repeats weekly';
      break;
    case 'monthly':
      desc =
        dayOfMonth !== null
          ? `Repeats monthly on day ${dayOfMonth}`
          : 'Repeats monthly';
      break;
  }

  if (endDate) {
    const end = new Date(endDate);
    desc += ` until ${end.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`;
  }

  return desc;
}

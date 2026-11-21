export interface BookingInterval {
  start: number;
  end: number;
}

export type BookingIssue =
  | 'invalid-time'
  | 'past-start'
  | 'too-long'
  | 'blocked'
  | 'overlap';

export interface BookingRulesInput {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: BookingInterval[];
}

export function getBookingReasons(input: BookingRulesInput): BookingIssue[] {
  const { start, end, now, blocked, bookings } = input;
  const reasons: BookingIssue[] = [];

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start < 0 ||
    end > 1440 ||
    start >= end
  ) {
    reasons.push('invalid-time');
  } else if (!Number.isFinite(now) || start <= now) {
    reasons.push('past-start');
  }

  if (
    Number.isFinite(start) &&
    Number.isFinite(end) &&
    end - start > 120
  ) {
    reasons.push('too-long');
  }

  if (blocked) {
    reasons.push('blocked');
  }

  if (Number.isFinite(start) && Number.isFinite(end)) {
    for (let i = 0; i < bookings.length; i++) {
      if (start < bookings[i].end && end > bookings[i].start) {
        reasons.push('overlap');
        break;
      }
    }
  }

  return reasons;
}

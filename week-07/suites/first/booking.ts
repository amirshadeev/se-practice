export interface Booking {
  start: number;
  end: number;
}

interface CanBookInput {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Booking[];
}

export function canBook({
  start,
  end,
  now,
  blocked,
  bookings,
}: CanBookInput): boolean {
  // AC1: valid time range and future start
  if (start < 0 || start >= end || end > 1440 || start <= now) {
    return false;
  }

  // AC2: maximum duration is 120 minutes
  if (end - start > 120) {
    return false;
  }

  // AC3: room must not be blocked
  if (blocked) {
    return false;
  }

  // AC4: overlapping bookings are not allowed
  for (let i = 0; i < bookings.length; i++) {
    if (start < bookings[i].end && end > bookings[i].start) {
      return false;
    }
  }

  return true;
}
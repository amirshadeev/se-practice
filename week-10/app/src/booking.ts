import { getBookingReasons } from './lib/bookingRules';

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
  return getBookingReasons({
    start,
    end,
    now,
    blocked,
    bookings,
  }).length === 0;
}

import type { Booking, Room } from './roomData';
import { getBookingReasons, type BookingIssue } from './bookingRules';

export type Decision =
  | { status: 'available' }
  | { status: 'unavailable'; reasons: string[] };

export interface CheckInput {
  start: number;
  end: number;
  currentTime: number;
  room: Room;
  bookings: Booking[];
}

export function checkAvailability(input: CheckInput): Decision {
  const { start, end, currentTime, room, bookings } = input;

  const roomBookings = bookings.filter((b) => b.roomId === room.id);

  const issues = getBookingReasons({
    start,
    end,
    now: currentTime,
    blocked: room.blocked,
    bookings: roomBookings,
  });

  if (issues.length === 0) {
    return { status: 'available' };
  }

  const reasons = issues.map((issue: BookingIssue) => {
    switch (issue) {
      case 'invalid-time':
        return 'The selected time range is invalid. Start must be earlier than end, and both must be within 00:00–24:00.';
      case 'past-start':
        return 'The start time must be after the current time.';
      case 'too-long':
        return `Bookings cannot exceed 120 minutes. Your selection is ${end - start} minutes.`;
      case 'blocked':
        return `${room.name} is currently blocked and cannot be booked.`;
      case 'overlap': {
        const overlap = roomBookings.find(
          (b) => start < b.end && end > b.start,
        );
        return overlap
          ? `The interval overlaps an existing booking (${formatTime(overlap.start)}–${formatTime(overlap.end)}: ${overlap.title}).`
          : 'The interval overlaps an existing booking.';
      }
    }
  });

  return { status: 'unavailable', reasons };
}

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

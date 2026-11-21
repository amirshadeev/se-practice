import type { Booking, Room } from './roomData';

export type Decision =
  | { status: 'available' }
  | { status: 'unavailable'; reasons: string[] };

export interface CheckInput {
  start: number;
  end: number;
  currentTime: number; // minutes from 00:00
  room: Room;
  bookings: Booking[];
}

const MAX_DURATION = 120;

/**
 * Evaluate a candidate booking interval against all acceptance criteria.
 * AC1: 0 тЙд start < end тЙд 1440 and start > currentTime
 * AC2: duration тЙд 120 min
 * AC3: room must not be blocked
 * AC4: no overlap with existing bookings (touching endpoints allowed)
 */
export function checkAvailability(input: CheckInput): Decision {
  const { start, end, currentTime, room, bookings } = input;
  const reasons: string[] = [];

  // AC1 тАУ interval validity
  if (start < 0 || end > 1440 || start >= end) {
    reasons.push('The selected time range is invalid. Start must be earlier than end, and both must be within 00:00тАУ24:00.');
  } else if (start <= currentTime) {
    reasons.push('The start time must be after the current time.');
  }

  // AC2 тАУ max duration
  const duration = end - start;
  if (duration > MAX_DURATION) {
    reasons.push(`Bookings cannot exceed ${MAX_DURATION} minutes. Your selection is ${duration} minutes.`);
  }

  // AC3 тАУ blocked room
  if (room.blocked) {
    reasons.push(`${room.name} is currently blocked and cannot be booked.`);
  }

  // AC4 тАУ overlap check (touching endpoints allowed)
  const roomBookings = bookings.filter((b) => b.roomId === room.id);
  const overlap = roomBookings.find(
    (b) => start < b.end && end > b.start,
  );
  if (overlap) {
    reasons.push(
      `The interval overlaps an existing booking (${formatTime(overlap.start)}тАУ${formatTime(overlap.end)}: ${overlap.title}).`,
    );
  }

  return reasons.length === 0
    ? { status: 'available' }
    : { status: 'unavailable', reasons };
}

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

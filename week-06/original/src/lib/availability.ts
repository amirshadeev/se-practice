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
 * AC1: 0 ≤ start < end ≤ 1440 and start > currentTime
 * AC2: duration ≤ 120 min
 * AC3: room must not be blocked
 * AC4: no overlap with existing bookings (touching endpoints allowed)
 */
export function checkAvailability(input: CheckInput): Decision {
  const { start, end, currentTime, room, bookings } = input;
  const reasons: string[] = [];

  // AC1 – interval validity
  if (start < 0 || end > 1440 || start >= end) {
    reasons.push('The selected time range is invalid. Start must be earlier than end, and both must be within 00:00–24:00.');
  } else if (start <= currentTime) {
    reasons.push('The start time must be after the current time.');
  }

  // AC2 – max duration
  const duration = end - start;
  if (duration > MAX_DURATION) {
    reasons.push(`Bookings cannot exceed ${MAX_DURATION} minutes. Your selection is ${duration} minutes.`);
  }

  // AC3 – blocked room
  if (room.blocked) {
    reasons.push(`${room.name} is currently blocked and cannot be booked.`);
  }

  // AC4 – overlap check (touching endpoints allowed)
  const roomBookings = bookings.filter((b) => b.roomId === room.id);
  const overlap = roomBookings.find(
    (b) => start < b.end && end > b.start,
  );
  if (overlap) {
    reasons.push(
      `The interval overlaps an existing booking (${formatTime(overlap.start)}–${formatTime(overlap.end)}: ${overlap.title}).`,
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

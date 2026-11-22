
import type { Booking, Room } from './rooms';

type CanBookInput = {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Booking[];
};

type CheckRoomInput = {
  start: number;
  end: number;
  now: number;
};

export function canBook(input: CanBookInput): boolean {
  const { start, end, now, blocked, bookings } = input;

  // AC1: valid time range and future booking
  if (start < 0 || end > 1440 || start >= end || start <= now) {
    return false;
  }

  // AC2: maximum duration is 120 minutes
  if (end - start > 120) {
    return false;
  }

  // AC3: blocked rooms cannot be booked
  if (blocked) {
    return false;
  }

  // AC4: overlapping bookings are not allowed
  for (let i = 0; i < bookings.length; i++) {
  const booking = bookings[i];

  if (start < booking.end && end > booking.start) {
    return false;
  }
  }

  // AC5: do not modify the bookings array
  return true;
}

export function checkRoom(
  rooms: Room[],
  roomId: string,
  input: CheckRoomInput
): boolean {
  const selectedRoom = rooms.find((room) => room.id === roomId);

  if (!selectedRoom) {
    return false;
  }

  return canBook({
    start: input.start,
    end: input.end,
    now: input.now,
    blocked: selectedRoom.blocked,
    bookings: selectedRoom.bookings,
  });
}

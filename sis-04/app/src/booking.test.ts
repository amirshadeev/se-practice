
import { describe, it, expect } from 'vitest';
import { canBook, checkRoom } from './booking';
import { ROOMS } from './rooms';
import { filterRooms } from './filter';
describe('canBook', () => {
  it('AC1: rejects past bookings and invalid time ranges', () => {
    expect(canBook({
      start: 500, end: 560, now: 600,
      blocked: false, bookings: [],
    })).toBe(false);

    expect(canBook({
      start: 700, end: 700, now: 600,
      blocked: false, bookings: [],
    })).toBe(false);
  });

  it('AC2: rejects bookings longer than 120 minutes', () => {
    expect(canBook({
      start: 700, end: 821, now: 600,
      blocked: false, bookings: [],
    })).toBe(false);
  });

  it('AC3: rejects blocked rooms', () => {
    expect(canBook({
      start: 700, end: 760, now: 600,
      blocked: true, bookings: [],
    })).toBe(false);
  });

  it('AC4: rejects overlapping bookings', () => {
    expect(canBook({
      start: 590, end: 620, now: 500,
      blocked: false,
      bookings: [{ id: 'b1', start: 600, end: 660, title: 'Test' }],
    })).toBe(false);
  });

  it('AC5: does not modify the bookings array', () => {
    const bookings = [
      { id: 'b1', start: 600, end: 660, title: 'Test' },
    ];
    const original = JSON.stringify(bookings);

    canBook({
      start: 700, end: 760, now: 600,
      blocked: false, bookings,
    });

    expect(JSON.stringify(bookings)).toBe(original);
  });

  it('B1: accepts exactly 120 minutes', () => {
    expect(canBook({
      start: 700, end: 820, now: 600,
      blocked: false, bookings: [],
    })).toBe(true);
  });

  it('B2: rejects 121 minutes', () => {
    expect(canBook({
      start: 700, end: 821, now: 600,
      blocked: false, bookings: [],
    })).toBe(false);
  });

  it('B3: allows bookings that touch an existing booking endpoint', () => {
    expect(canBook({
      start: 660, end: 720, now: 600,
      blocked: false,
      bookings: [{ id: 'b1', start: 600, end: 660, title: 'Test' }],
    })).toBe(true);
  });

  it('B4: rejects a partial overlap', () => {
    expect(canBook({
      start: 650, end: 700, now: 600,
      blocked: false,
      bookings: [{ id: 'b1', start: 600, end: 660, title: 'Test' }],
    })).toBe(false);
  });
});

describe('checkRoom', () => {
  it('INT: checks availability using the selected room bookings', () => {
    expect(checkRoom(ROOMS, 'r2', {
      start: 660, end: 720, now: 600,
    })).toBe(true);

    expect(checkRoom(ROOMS, 'r1', {
      start: 660, end: 720, now: 600,
    })).toBe(true);
  });
  
  it('INT: filters rooms and checks availability of a matching room', () => {
    const filteredRooms = filterRooms(ROOMS, {
      attendees: 20,
      equipment: ['projector', 'computers'],
    });

    expect(filteredRooms.map((room) => room.id)).toEqual(['r2']);

    expect(checkRoom(ROOMS, filteredRooms[0].id, {
      start: 660,
      end: 720,
      now: 600,
    })).toBe(true);
  });

  it('returns false for an unknown room ID', () => {
    expect(checkRoom(ROOMS, 'unknown', {
      start: 700, end: 760, now: 600,
    })).toBe(false);
  });
});


import { describe, it, expect } from 'vitest';
import { canBook, type Booking } from './booking';

describe('canBook Function Tests', () => {
  const baseBookings: Booking[] = [{ start: 600, end: 660 }];

  it('T01: valid booking immediately after existing booking', () => {
    expect(canBook({
      start: 660, end: 720, now: 540,
      blocked: false, bookings: baseBookings,
    })).toBe(true);
  });

  it('T02: start time equals now', () => {
    expect(canBook({
      start: 540, end: 570, now: 540,
      blocked: false, bookings: baseBookings,
    })).toBe(false);
  });

  it('T03: zero duration', () => {
    expect(canBook({
      start: 720, end: 720, now: 540,
      blocked: false, bookings: baseBookings,
    })).toBe(false);
  });

  it('T04: start is later than end', () => {
    expect(canBook({
      start: 750, end: 720, now: 540,
      blocked: false, bookings: baseBookings,
    })).toBe(false);
  });

  it('T05: end exceeds 1440', () => {
    expect(canBook({
      start: 1380, end: 1441, now: 540,
      blocked: false, bookings: baseBookings,
    })).toBe(false);
  });

  it('T06: exactly 120 minutes is allowed', () => {
    expect(canBook({
      start: 720, end: 840, now: 540,
      blocked: false, bookings: baseBookings,
    })).toBe(true);
  });

  it('T07: 121 minutes is rejected', () => {
    expect(canBook({
      start: 720, end: 841, now: 540,
      blocked: false, bookings: baseBookings,
    })).toBe(false);
  });

  it('T08: booking immediately before existing booking', () => {
    expect(canBook({
      start: 570, end: 600, now: 540,
      blocked: false, bookings: baseBookings,
    })).toBe(true);
  });

  it('T09: partial overlap', () => {
    expect(canBook({
      start: 630, end: 690, now: 540,
      blocked: false, bookings: baseBookings,
    })).toBe(false);
  });

  it('T10: new booking contains existing booking', () => {
    expect(canBook({
      start: 570, end: 690, now: 540,
      blocked: false, bookings: baseBookings,
    })).toBe(false);
  });

  it('T11: new booking is inside existing booking', () => {
    expect(canBook({
      start: 615, end: 645, now: 540,
      blocked: false, bookings: baseBookings,
    })).toBe(false);
  });

  it('T12: exact duplicate booking', () => {
    expect(canBook({
      start: 600, end: 660, now: 540,
      blocked: false, bookings: baseBookings,
    })).toBe(false);
  });

  it('T13: blocked room rejects an otherwise valid booking', () => {
    expect(canBook({
      start: 660, end: 720, now: 540,
      blocked: true, bookings: baseBookings,
    })).toBe(false);
  });

  it('T14: valid booking with empty bookings list', () => {
    expect(canBook({
      start: 630, end: 690, now: 540,
      blocked: false, bookings: [],
    })).toBe(true);
  });

  it('T15: negative start time is rejected', () => {
    expect(canBook({
      start: -10, end: 60, now: -20,
      blocked: false, bookings: [],
    })).toBe(false);
  });

  it('X1: one-minute booking after now', () => {
    expect(canBook({
      start: 541, end: 542, now: 540,
      blocked: false, bookings: baseBookings,
    })).toBe(true);
  });

  it('X2: booking ending exactly at 1440', () => {
    expect(canBook({
      start: 1320, end: 1440, now: 540,
      blocked: false, bookings: baseBookings,
    })).toBe(true);
  });
  it('AC5: bookings array and elements remain unchanged', () => {
    const bookings: Booking[] = [{ start: 600, end: 660 }];
    const originalSnapshot = JSON.stringify(bookings);

    const result = canBook({
      start: 660,
      end: 720,
      now: 540,
      blocked: false,
      bookings,
    });

    expect(result).toBe(true);
    expect(JSON.stringify(bookings)).toBe(originalSnapshot);
  });
});
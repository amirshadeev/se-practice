import { describe, it, expect } from 'vitest';
import { canBook, Booking } from './booking';

describe('canBook Function Tests', () => {
  const baseBookings: Booking[] = [{ start: 600, end: 660 }];

  it('T01: valid booking slot immediately after existing booking', () => {
    const result = canBook({
      start: 660,
      end: 720,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(true);
  });

  it('T02: start time is in the past (start <= now)', () => {
    const result = canBook({
      start: 540,
      end: 570,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(false);
  });

  it('T03: zero duration booking (start === end)', () => {
    const result = canBook({
      start: 720,
      end: 720,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(false);
  });

  it('T04: negative duration (start > end)', () => {
    const result = canBook({
      start: 750,
      end: 720,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(false);
  });

  it('T05: exceeds maximum duration of 120 minutes', () => {
    const result = canBook({
      start: 1380,
      end: 1441,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(false);
  });

  it('T06: valid booking with maximum allowed duration (120 minutes)', () => {
    const result = canBook({
      start: 720,
      end: 840,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(true);
  });

  it('T07: duration exceeds 120 minutes by 1 minute', () => {
    const result = canBook({
      start: 720,
      end: 841,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(false);
  });

  it('T08: valid booking slot immediately before existing booking', () => {
    const result = canBook({
      start: 570,
      end: 600,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(true);
  });

  it('T09: partial overlap with existing booking (starts during, ends after)', () => {
    const result = canBook({
      start: 630,
      end: 690,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(false);
  });

  it('T10: completely encapsulates existing booking', () => {
    const result = canBook({
      start: 570,
      end: 690,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(false);
  });

  it('T11: completely contained within existing booking', () => {
    const result = canBook({
      start: 615,
      end: 645,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(false);
  });

  it('T12: exact duplicate of existing booking', () => {
    const result = canBook({
      start: 600,
      end: 660,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(false);
  });

  it('T13: room is blocked', () => {
    const result = canBook({
      start: 630,
      end: 690,
      now: 540,
      blocked: true,
      bookings: baseBookings,
    });
    expect(result).toBe(false);
  });

  it('T14: valid booking when bookings list is empty', () => {
    const result = canBook({
      start: 630,
      end: 690,
      now: 540,
      blocked: false,
      bookings: [],
    });
    expect(result).toBe(true);
  });

  it('X1: valid minimal duration booking in the near future', () => {
    const result = canBook({
      start: 541,
      end: 542,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(true);
  });

  it('X2: valid maximum-duration booking late in the day', () => {
    const result = canBook({
      start: 1320,
      end: 1440,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(true);
  });

  it('Immutability check: ensures bookings array and elements are unchanged', () => {
    const bookings: Booking[] = [{ start: 600, end: 660 }];
    const bookingsCopy = JSON.parse(JSON.stringify(bookings));

    canBook({
      start: 660,
      end: 720,
      now: 540,
      blocked: false,
      bookings,
    });

    expect(bookings).toEqual(bookingsCopy);
  });
});
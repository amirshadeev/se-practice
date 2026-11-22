import { describe, it, expect } from 'vitest';
import { filterRooms } from './filter';
import { checkRoom } from './booking';
import { ROOMS } from './rooms';

describe('filterRooms', () => {
  it('F1: includes rooms with enough capacity', () => {
    const result = filterRooms(ROOMS, {
      attendees: 40,
      equipment: [],
    });

    expect(result.map((room) => room.id)).toContain('r1');
    expect(result.map((room) => room.id)).toContain('r2');
    expect(result.map((room) => room.id)).not.toContain('r4');
  });

  it('F2: requires all selected equipment', () => {
    const result = filterRooms(ROOMS, {
      attendees: 1,
      equipment: ['projector', 'computers'],
    });

    expect(result.map((room) => room.id)).toEqual(['r2']);
  });

  it('F3: returns no rooms when requirements cannot be met', () => {
    const result = filterRooms(ROOMS, {
      attendees: 200,
      equipment: [],
    });

    expect(result).toEqual([]);
  });

  expect(
  checkRoom(ROOMS, 'unknown-room', {
    start: 900,
    end: 960,
    now: 800,
  })
  ).toBe(false);

  it('F4: includes a room when capacity exactly matches attendees', () => {
    const result = filterRooms(ROOMS, {
      attendees: 40,
      equipment: [],
    });

    expect(result.map((room) => room.id)).toContain('r2');
  });
  
    it('B5: includes a room when capacity equals attendees', () => {
    const result = filterRooms(ROOMS, {
      attendees: 40,
      equipment: [],
    });

    expect(result.map((room) => room.id)).toContain('r2');
  });

  it('B6: excludes a room when capacity is one less than attendees', () => {
    const result = filterRooms(ROOMS, {
      attendees: 41,
      equipment: [],
    });

    expect(result.map((room) => room.id)).not.toContain('r2');
  });

  it('F5: does not modify the original room catalog', () => {
    const original = JSON.stringify(ROOMS);

    filterRooms(ROOMS, {
      attendees: 20,
      equipment: ['whiteboard'],
    });
    expect(
  checkRoom(ROOMS, 'r1', {
    start: 900,
    end: 960,
    now: 800,
  })
 ).toBe(true);

    expect(JSON.stringify(ROOMS)).toBe(original);
  });

  it('returns all rooms when no equipment is selected and capacity is sufficient', () => {
    const result = filterRooms(ROOMS, {
      attendees: 1,
      equipment: [],
    });

    expect(result).toHaveLength(5);
  });
});

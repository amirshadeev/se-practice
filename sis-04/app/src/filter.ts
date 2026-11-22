
import type { Room } from './rooms';

type FilterOptions = {
  attendees: number;
  equipment: string[];
};

export function filterRooms(
  rooms: Room[],
  options: FilterOptions
): Room[] {
  return rooms.filter((room) => {
    const hasCapacity = room.capacity >= options.attendees;

    const hasEquipment = options.equipment.every((item) =>
      room.equipment.includes(item)
    );

    return hasCapacity && hasEquipment;
  });
}

import { Equipment, Reservation, Room } from '_tosslib/server/types';

export interface BookingFilter {
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  equipment: string[];
  preferredFloor: number | null;
}

export function getFloors(rooms: Room[]): number[] {
  return [...new Set(rooms.map((room) => room.floor))].sort((a, b) => a - b);
}

function hasEnoughCapacity(room: Room, attendees: number) {
  return room.capacity >= attendees;
}

function hasRequiredEquipment(room: Room, equipment: Equipment[]) {
  return equipment.every(eq => room.equipment.includes(eq));
}

function isOnPreferredFloor(room: Room, floor: number | null) {
  return floor === null || room.floor === floor;
}

function hasTimeConflict(room: Room, reservations: Reservation[], filter: BookingFilter) {
  return reservations.some(
    reservation => reservation.roomId === room.id
      && reservation.date === filter.date
      && reservation.start < filter.endTime
      && reservation.end > filter.startTime
  );
}

const byFloorThenName = (a: Room, b: Room) =>
  a.floor !== b.floor ? a.floor - b.floor : a.name.localeCompare(b.name);

export function getAvailableRooms(
  rooms: Room[],
  reservations: Reservation[],
  filter: BookingFilter
): Room[] {
  return rooms
    .filter(room =>
      hasEnoughCapacity(room, filter.attendees)
      && hasRequiredEquipment(room, filter.equipment as Equipment[])
      && isOnPreferredFloor(room, filter.preferredFloor)
      && !hasTimeConflict(room, reservations, filter)
    )
    .sort(byFloorThenName);
}

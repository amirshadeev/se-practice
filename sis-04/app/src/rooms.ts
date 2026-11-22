
export type Booking = {
  id: string;
  start: number;
  end: number;
  title: string;
};

export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: Booking[];
};

export const ROOMS: Room[] = [
  {
    id: 'r1',
    name: 'Athena Hall',
    capacity: 120,
    equipment: ['projector', 'whiteboard', 'microphone'],
    blocked: false,
    bookings: [
      { id: 'b1', start: 540, end: 600, title: 'Data Structures' },
      { id: 'b2', start: 780, end: 840, title: 'Embedded Systems' },
    ],
  },
  {
    id: 'r2',
    name: 'Newton Lab',
    capacity: 40,
    equipment: ['projector', 'computers'],
    blocked: false,
    bookings: [
      { id: 'b3', start: 600, end: 660, title: 'Physics Tutorial' },
    ],
  },
  {
    id: 'r3',
    name: 'Curie Lecture Room',
    capacity: 80,
    equipment: ['projector', 'microphone', 'whiteboard'],
    blocked: true,
    bookings: [],
  },
  {
    id: 'r4',
    name: 'Turing Studio',
    capacity: 30,
    equipment: ['computers', 'whiteboard'],
    blocked: false,
    bookings: [
      { id: 'b4', start: 480, end: 540, title: 'Robotics Workshop' },
    ],
  },
  {
    id: 'r5',
    name: 'Da Vinci Room',
    capacity: 25,
    equipment: ['whiteboard', 'projector'],
    blocked: false,
    bookings: [
      { id: 'b5', start: 840, end: 900, title: 'Sketching Class' },
    ],
  },
];

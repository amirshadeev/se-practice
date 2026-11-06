export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  start: number; // minutes from 00:00
  end: number;   // minutes from 00:00
  title: string;
}

export const rooms: Room[] = [
  { id: 'r1', name: 'Athena Hall',   building: 'Engineering Block',  capacity: 120, blocked: false },
  { id: 'r2', name: 'Newton Lab',    building: 'Science Wing',       capacity: 40,  blocked: false },
  { id: 'r3', name: 'Curie Lecture', building: 'Science Wing',       capacity: 80,  blocked: true  },
  { id: 'r4', name: 'Turing Studio', building: 'IT Centre',          capacity: 30,  blocked: false },
  { id: 'r5', name: 'Da Vinci Room', building: 'Arts & Design',      capacity: 25,  blocked: false },
];

export const initialBookings: Booking[] = [
  { id: 'b1', roomId: 'r1', start: 540,  end: 600,  title: 'Data Structures 101' },
  { id: 'b2', roomId: 'r1', start: 780,  end: 840,  title: 'Embedded Systems Lab' },
  { id: 'b3', roomId: 'r2', start: 600,  end: 660,  title: 'Physics Tutorial' },
  { id: 'b4', roomId: 'r4', start: 480,  end: 540,  title: 'Robotics Workshop' },
  { id: 'b5', roomId: 'r5', start: 840,  end: 900,  title: 'Sketching Class' },
  { id: 'b6', roomId: 'r2', start: 1020, end: 1080, title: 'Chemistry Seminar' },
];

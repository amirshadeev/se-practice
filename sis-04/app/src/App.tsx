
import { useMemo, useState } from 'react';
import {
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  CalendarCheck,
  Lock,
  Info,
} from 'lucide-react';
import { ROOMS } from './rooms';
import { filterRooms } from './filter';
import { checkRoom } from './booking';

const MAX_DURATION = 120;
const TIME_STEP = 15;
const CURRENT_TIME_DEFAULT = 600;

function minutesToInputValue(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
}

function inputValueToMinutes(value: string): number {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTime(minutes: number): string {
  return minutesToInputValue(minutes);
}

export default function App() {
  const [selectedRoomId, setSelectedRoomId] = useState(ROOMS[0].id);
  const [startStr, setStartStr] = useState('10:30');
  const [endStr, setEndStr] = useState('11:30');
  const [currentTime, setCurrentTime] = useState(CURRENT_TIME_DEFAULT);
  const [attendees, setAttendees] = useState(1);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [decision, setDecision] = useState<boolean | null>(null);

  const selectedRoom = useMemo(
    () => ROOMS.find((room) => room.id === selectedRoomId) ?? ROOMS[0],
    [selectedRoomId],
  );

  const filteredRooms = useMemo(
    () => filterRooms(ROOMS, { attendees, equipment }),
    [attendees, equipment],
  );

  const roomBookings = useMemo(
    () => [...selectedRoom.bookings].sort((a, b) => a.start - b.start),
    [selectedRoom],
  );

  const startMin = inputValueToMinutes(startStr);
  const endMin = inputValueToMinutes(endStr);
  const duration = endMin - startMin;
  const overLimit = duration > MAX_DURATION;

  const handleCheck = () => {
    const result = checkRoom(ROOMS, selectedRoomId, {
      start: startMin,
      end: endMin,
      now: currentTime,
    });

    setDecision(result);
  };

  const toggleEquipment = (item: string) => {
    setEquipment((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item],
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500 p-2.5 rounded-xl shadow-lg">
              <CalendarCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Smart Campus Room Availability
              </h1>
              <p className="text-slate-300 text-sm sm:text-base mt-0.5">
                Check whether a lecture hall or lab is free for your time slot.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-7">
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            Booking Request
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label htmlFor="attendees" className="block text-sm font-medium text-slate-600 mb-1.5">
                Number of attendees
              </label>
              <input
                id="attendees"
                type="number"
                min="1"
                value={attendees}
                onChange={(event) => {
                  setAttendees(Math.max(1, Number(event.target.value)));
                  setDecision(null);
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label htmlFor="equipment" className="block text-sm font-medium text-slate-600 mb-1.5">
                Required equipment
              </label>
              <p className="text-xs text-slate-400">
                Select all that are needed below.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-5">
            {['projector', 'whiteboard', 'microphone', 'computers'].map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={equipment.includes(item)}
                  onChange={() => {
                    toggleEquipment(item);
                    setDecision(null);
                  }}
                  className="accent-teal-600"
                />
                <span className="capitalize">{item}</span>
              </label>
            ))}
          </div>

          <h3 className="text-sm font-semibold text-slate-700 mb-2">
            Matching rooms ({filteredRooms.length})
          </h3>

          {filteredRooms.length === 0 ? (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5">
              No rooms match the selected capacity and equipment requirements.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 mb-5">
              {filteredRooms.map((room) => {
                const active = room.id === selectedRoomId;

                return (
                  <button
                    key={room.id}
                    onClick={() => {
                      setSelectedRoomId(room.id);
                      setDecision(null);
                    }}
                    className={[
                      'text-left rounded-xl border p-4 transition-all duration-200',
                      active
                        ? 'border-teal-500 ring-2 ring-teal-200 bg-teal-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                    ].join(' ')}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-800">{room.name}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Users className="w-3 h-3" />
                          {room.capacity} seats
                        </p>
                        <p className="text-xs text-slate-500 mt-1 capitalize">
                          {room.equipment.join(', ')}
                        </p>
                      </div>
                      {room.blocked && (
                        <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                          <Lock className="w-3 h-3" />
                          Blocked
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {!filteredRooms.some((room) => room.id === selectedRoomId) && (
            <p className="text-sm text-amber-700 mb-5">
              The selected room does not match the current filters. Select a matching room to continue.
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label htmlFor="start-time" className="block text-sm font-medium text-slate-600 mb-1.5">
                Start Time
              </label>
              <input
                id="start-time"
                type="time"
                step={TIME_STEP * 60}
                value={startStr}
                onChange={(event) => {
                  setStartStr(event.target.value);
                  setDecision(null);
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label htmlFor="end-time" className="block text-sm font-medium text-slate-600 mb-1.5">
                End Time
              </label>
              <input
                id="end-time"
                type="time"
                step={TIME_STEP * 60}
                value={endStr}
                onChange={(event) => {
                  setEndStr(event.target.value);
                  setDecision(null);
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="current-time" className="block text-sm font-medium text-slate-600 mb-1.5">
              Current Time (simulated)
            </label>
            <input
              id="current-time"
              type="time"
              step={TIME_STEP * 60}
              value={minutesToInputValue(currentTime)}
              onChange={(event) => {
                setCurrentTime(inputValueToMinutes(event.target.value));
                setDecision(null);
              }}
              className="w-full sm:w-48 rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
            />
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <Info className="w-3 h-3" />
              The candidate start must be after this time.
            </p>
          </div>

          <div className="mb-5">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="font-medium text-slate-600">Duration</span>
              <span className={overLimit ? 'text-red-600 font-semibold' : 'text-slate-500'}>
                {duration > 0 ? `${duration} min` : '—'}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${overLimit ? 'bg-red-500' : 'bg-teal-500'}`}
                style={{
                  width: `${Math.min(100, (Math.max(0, duration) / MAX_DURATION) * 100)}%`,
                }}
              />
            </div>
            {overLimit && (
              <p className="text-xs text-red-600 mt-1.5">
                Exceeds the {MAX_DURATION}-minute maximum.
              </p>
            )}
          </div>

          <button
            onClick={handleCheck}
            disabled={!filteredRooms.some((room) => room.id === selectedRoomId)}
            className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 shadow-sm"
          >
            Check Availability
          </button>

          {decision !== null && (
            <div className={`mt-5 rounded-xl border p-4 ${decision ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
              <div className="flex items-center gap-2.5 mb-1">
                {decision ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                )}
                <span className={`font-bold text-base ${decision ? 'text-green-700' : 'text-red-700'}`}>
                  {decision ? 'Available' : 'Unavailable'}
                </span>
              </div>
              {decision ? (
                <p className="text-sm text-green-700 pl-7">
                  {selectedRoom.name} is free from {formatTime(startMin)} to {formatTime(endMin)}.
                </p>
              ) : (
                <p className="text-sm text-red-700 pl-7">
                  This room cannot be booked for the selected time. Check the time, duration, room status, and existing bookings.
                </p>
              )}
            </div>
          )}
        </section>

        <aside className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-7">
          <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-600" />
            {selectedRoom.name}
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Existing bookings for this room
          </p>

          {roomBookings.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">
              No bookings scheduled.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {roomBookings.map((booking) => (
                <li key={booking.id} className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5">
                  <div className="bg-teal-50 text-teal-700 rounded-md px-2 py-1 text-xs font-mono font-semibold whitespace-nowrap">
                    {formatTime(booking.start)}–{formatTime(booking.end)}
                  </div>
                  <span className="text-sm text-slate-600 truncate">
                    {booking.title}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </main>

      <footer className="text-center text-xs text-slate-400 pb-8">
        Fictional sample data · For demonstration purposes only
      </footer>
    </div>
  );
}

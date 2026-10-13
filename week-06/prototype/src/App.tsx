import { useMemo, useState } from 'react';
import {
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  CalendarCheck,
  Lock,
  Building2,
  Info,
} from 'lucide-react';
import { rooms, initialBookings, type Booking } from '@/lib/roomData';
import { checkAvailability, formatTime, type Decision } from '@/lib/availability';

const MAX_DURATION = 120;
const TIME_STEP = 15;

function minutesToInputValue(m: number): string {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

function inputValueToMinutes(v: string): number {
  const [h, m] = v.split(':').map(Number);
  return h * 60 + m;
}

const CURRENT_TIME_DEFAULT = 600; // 10:00

export default function App() {
  const [bookings] = useState<Booking[]>(initialBookings);
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0].id);
  const [startStr, setStartStr] = useState('10:30');
  const [endStr, setEndStr] = useState('11:30');
  const [currentTime, setCurrentTime] = useState(CURRENT_TIME_DEFAULT);
  const [decision, setDecision] = useState<Decision | null>(null);

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === selectedRoomId)!,
    [selectedRoomId],
  );

  const roomBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.roomId === selectedRoomId)
        .sort((a, z) => a.start - z.start),
    [bookings, selectedRoomId],
  );

  const duration =
    inputValueToMinutes(endStr) - inputValueToMinutes(startStr);

  const overLimit = duration > MAX_DURATION;
  const startMin = inputValueToMinutes(startStr);
  const endMin = inputValueToMinutes(endStr);

  const handleCheck = () => {
    const result = checkAvailability({
      start: startMin,
      end: endMin,
      currentTime,
      room: selectedRoom,
      bookings,
    });
    setDecision(result);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
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
        {/* Left: form */}
        <section className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-7">
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            Booking Request
          </h2>

          {/* Room selection */}
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Select Room
          </label>
          <div className="grid gap-3 sm:grid-cols-2 mb-5">
            {rooms.map((room) => {
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
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">{room.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3" />
                        {room.building}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Users className="w-3 h-3" />
                        {room.capacity} seats
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

          {/* Time inputs */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label
                htmlFor="start-time"
                className="block text-sm font-medium text-slate-600 mb-1.5"
              >
                Start Time
              </label>
              <input
                id="start-time"
                type="time"
                step={TIME_STEP * 60}
                value={startStr}
                onChange={(e) => {
                  setStartStr(e.target.value);
                  setDecision(null);
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
              />
            </div>
            <div>
              <label
                htmlFor="end-time"
                className="block text-sm font-medium text-slate-600 mb-1.5"
              >
                End Time
              </label>
              <input
                id="end-time"
                type="time"
                step={TIME_STEP * 60}
                value={endStr}
                onChange={(e) => {
                  setEndStr(e.target.value);
                  setDecision(null);
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
              />
            </div>
          </div>

          {/* Current-time control */}
          <div className="mb-5">
            <label
              htmlFor="current-time"
              className="block text-sm font-medium text-slate-600 mb-1.5"
            >
              Current Time (simulated)
            </label>
            <input
              id="current-time"
              type="time"
              step={TIME_STEP * 60}
              value={minutesToInputValue(currentTime)}
              onChange={(e) => {
                setCurrentTime(inputValueToMinutes(e.target.value));
                setDecision(null);
              }}
              className="w-full sm:w-48 rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
            />
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <Info className="w-3 h-3" />
              The candidate start must be after this time.
            </p>
          </div>

          {/* Duration indicator */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="font-medium text-slate-600">Duration</span>
              <span
                className={
                  overLimit
                    ? 'text-red-600 font-semibold'
                    : 'text-slate-500'
                }
              >
                {duration > 0 ? `${duration} min` : '—'}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={[
                  'h-full transition-all duration-300',
                  overLimit ? 'bg-red-500' : 'bg-teal-500',
                ].join(' ')}
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

          {/* Check button */}
          <button
            onClick={handleCheck}
            className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 shadow-sm"
          >
            Check Availability
          </button>

          {/* Decision banner */}
          {decision && (
            <div
              className={[
                'mt-5 rounded-xl border p-4 transition-all duration-300',
                decision.status === 'available'
                  ? 'border-green-300 bg-green-50'
                  : 'border-red-300 bg-red-50',
              ].join(' ')}
            >
              <div className="flex items-center gap-2.5 mb-1">
                {decision.status === 'available' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                )}
                <span
                  className={[
                    'font-bold text-base',
                    decision.status === 'available'
                      ? 'text-green-700'
                      : 'text-red-700',
                  ].join(' ')}
                >
                  {decision.status === 'available'
                    ? 'Available'
                    : 'Unavailable'}
                </span>
              </div>
              {decision.status === 'unavailable' && (
                <ul className="mt-1.5 space-y-1 pl-7">
                  {decision.reasons.map((r, i) => (
                    <li key={i} className="text-sm text-red-600 list-disc">
                      {r}
                    </li>
                  ))}
                </ul>
              )}
              {decision.status === 'available' && (
                <p className="text-sm text-green-700 pl-7">
                  {selectedRoom.name} is free from {formatTime(startMin)} to{' '}
                  {formatTime(endMin)}. No existing bookings overlap this
                  interval.
                </p>
              )}
            </div>
          )}
        </section>

        {/* Right: existing bookings */}
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
              {roomBookings.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5"
                >
                  <div className="bg-teal-50 text-teal-700 rounded-md px-2 py-1 text-xs font-mono font-semibold whitespace-nowrap">
                    {formatTime(b.start)}–{formatTime(b.end)}
                  </div>
                  <span className="text-sm text-slate-600 truncate">
                    {b.title}
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

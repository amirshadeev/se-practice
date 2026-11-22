# Smart Campus Room Booking

A React and TypeScript application for filtering study rooms and checking booking availability.

## Features

- Filter rooms by attendee capacity.
- Filter rooms by required equipment.
- Check availability for a selected time range.
- Reject invalid, past, blocked, overlapping, and overlong bookings.
- Show an empty state when no rooms match the filters.
- Refresh availability when a different room is selected.

## Project Structure

- `src/App.tsx` - User interface and interaction.
- `src/rooms.ts` - Room and booking types and room catalog.
- `src/filter.ts` - Room filtering by capacity and equipment.
- `src/booking.ts` - Booking validation and availability checks.
- `src/booking.test.ts` - Booking and integration tests.
- `src/filter.test.ts` - Room filtering tests.

## Requirements

- Node.js
- npm

## Installation

Run `npm ci`.

## Development

Run `npm run dev`.

## Quality Checks

- `npm run typecheck`
- `npm run lint`
- `npx vitest run`
- `npm run build`

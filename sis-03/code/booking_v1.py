
def can_book(start, end, now, blocked, existing):
    """Return whether the booking request is allowed."""

    # AC1: Validate time boundaries and ensure the start is in the future.
    if not isinstance(start, int) or isinstance(start, bool):
        return False

    if not isinstance(end, int) or isinstance(end, bool):
        return False

    if not isinstance(now, int) or isinstance(now, bool):
        return False

    if start < 0 or end > 1440 or start >= end:
        return False

    if start <= now:
        return False

    # AC2: Booking duration cannot exceed 120 minutes.
    if end - start > 120:
        return False

    # AC3: A blocked room cannot accept bookings.
    if blocked:
        return False

    # AC4: Check for overlapping bookings.
    for existing_start, existing_end in existing:
        if start < existing_end and end > existing_start:
            return False

    # AC5: Do not modify existing bookings.
    return True

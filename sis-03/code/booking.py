
def can_book(start, end, now, blocked, existing):
    """Return whether the booking request is allowed."""

    # Validate input types.
    if type(start) is not int or type(end) is not int or type(now) is not int:
        return False

    if type(blocked) is not bool:
        return False

    if not isinstance(existing, (list, tuple)):
        return False

    # AC1: Validate time boundaries and future start.
    if start < 0 or end > 1440 or start >= end:
        return False

    if start <= now:
        return False

    # AC2: Maximum booking duration is 120 minutes.
    if end - start > 120:
        return False

    # AC3: Reject bookings when the room is blocked.
    if blocked:
        return False

    # AC4: Validate existing bookings and check overlaps.
    for booking in existing:
        if not isinstance(booking, (list, tuple)) or len(booking) != 2:
            return False

        existing_start, existing_end = booking

        if type(existing_start) is not int or type(existing_end) is not int:
            return False

        if existing_start < 0 or existing_end > 1440 or existing_start >= existing_end:
            return False

        if start < existing_end and end > existing_start:
            return False

    # AC5: Existing bookings are never modified.
    return True

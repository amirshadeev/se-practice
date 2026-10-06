import unittest
from booking import can_book


class BookingTests(unittest.TestCase):
    def test_touching_end_is_allowed(self):
        result = can_book(660, 720, 540, False, [(600, 660)])
        self.assertIs(result, True)
import unittest

from booking import can_book


class BookingTests(unittest.TestCase):

    def test_touching_end_is_allowed(self):
        result = can_book(660, 720, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_overlap_is_rejected(self):
        result = can_book(630, 690, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_blocked_room_is_rejected(self):
        result = can_book(660, 720, 540, True, [(600, 660)])
        self.assertIs(result, False)

    def test_exactly_two_hours_is_allowed(self):
        result = can_book(720, 840, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_over_two_hours_is_rejected(self):
        result = can_book(720, 841, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_starting_now_is_rejected(self):
        result = can_book(540, 570, 540, False, [(600, 660)])
        self.assertIs(result, False)
    
    def test_zero_length_is_rejected(self):
        result = can_book(600, 600, 540, False, [])
        self.assertIs(result, False)

    def test_reversed_time_is_rejected(self):
        result = can_book(700, 600, 540, False, [])
        self.assertIs(result, False)

    def test_end_at_1440_is_allowed(self):
        result = can_book(1320, 1440, 1200, False, [])
        self.assertIs(result, True)

    def test_empty_existing_allows_free_slot(self):
        result = can_book(600, 720, 540, False, [])
        self.assertIs(result, True)

    def test_input_existing_is_unchanged(self):
        existing = [(600, 660), (720, 780)]
        original = existing.copy()

        result = can_book(840, 900, 540, False, existing)

        self.assertIs(result, True)
        self.assertEqual(existing, original)
    def test_negative_start_is_rejected(self):
        result = can_book(-1, 100, 0, False, [])
        self.assertIs(result, False)

    def test_end_after_1440_is_rejected(self):
        result = can_book(1320, 1441, 1200, False, [])
        self.assertIs(result, False)

    def test_partial_overlap_at_end_is_rejected(self):
        result = can_book(650, 700, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_partial_overlap_at_start_is_rejected(self):
        result = can_book(550, 610, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_request_contains_existing_booking_is_rejected(self):
        result = can_book(570, 690, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_second_existing_booking_is_checked(self):
        result = can_book(720, 750, 540, False, [(600, 660), (700, 740)])
        self.assertIs(result, False)

    def test_touching_start_is_allowed(self):
        result = can_book(540, 600, 500, False, [(600, 660)])
        self.assertIs(result, True)

    def test_result_is_boolean(self):
        result = can_book(660, 720, 540, False, [(600, 660)])
        self.assertIs(type(result), bool)
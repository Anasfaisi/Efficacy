# Time Slot Integration Guide

## Quick Reference for Developers

### When Creating a Booking

**Frontend:**

```typescript
import { bookingApi } from "@/Services/booking.api";

// User selects a slot from BookingCalendar
const selectedSlot = "10:00 AM - 11:00 AM"; // From getAllSlots()

await bookingApi.createBooking({
  mentorId: mentor.id,
  bookingDate: selectedDate.toISOString(),
  slot: selectedSlot, // ✅ Pass the specific hourly slot
  topic: "Career Guidance",
});
```

**Backend receives:**

```json
{
  "mentorId": "507f1f77bcf86cd799439011",
  "bookingDate": "2026-02-05T00:00:00.000Z",
  "slot": "10:00 AM - 11:00 AM",
  "topic": "Career Guidance"
}
```

### When Booking a Mentorship Session

**Frontend:**

```typescript
import { mentorshipApi } from "@/Services/mentorship.api";

// User selects from BookingCalendar
const selectedDate = new Date("2026-02-05");
const selectedSlot = "02:00 PM - 03:00 PM";

await mentorshipApi.bookSession(
  mentorshipId,
  selectedDate,
  selectedSlot, // ✅ Pass the slot
);
```

**Backend receives:**

```json
{
  "date": "2026-02-05T00:00:00.000Z",
  "slot": "02:00 PM - 03:00 PM"
}
```

### When Rescheduling

**Frontend:**

```typescript
await mentorshipApi.rescheduleSession(mentorshipId, {
  sessionId: session.id,
  newDate: newDate,
  newSlot: "04:00 PM - 05:00 PM", // ✅ Include new slot
});
```

**Backend receives:**

```json
{
  "sessionId": "507f1f77bcf86cd799439011",
  "newDate": "2026-02-06T00:00:00.000Z",
  "newSlot": "04:00 PM - 05:00 PM"
}
```

### Generating Available Slots

**Frontend Utility:**

```typescript
import { getAllSlots } from "@/utils/timeUtils";

// Mentor's preferredTime from database
const mentorPreferredTime = [
  "morning (10 am - 12 pm)",
  "afternoon (1 pm - 5 pm)",
];

// Convert to hourly slots
const availableSlots = getAllSlots(mentorPreferredTime);
// Result: [
//   "10:00 AM - 11:00 AM",
//   "11:00 AM - 12:00 PM",
//   "01:00 PM - 02:00 PM",
//   "02:00 PM - 03:00 PM",
//   "03:00 PM - 04:00 PM",
//   "04:00 PM - 05:00 PM"
// ]
```

### Checking Slot Availability

**Frontend:**

```typescript
const bookedSlots = [
  { date: "2026-02-05", slot: "10:00 AM - 11:00 AM" },
  { date: "2026-02-05", slot: "02:00 PM - 03:00 PM" },
];

const isSlotBooked = bookedSlots.some(
  (bs) =>
    isSameDay(new Date(bs.date), selectedDate) &&
    bs.slot === "10:00 AM - 11:00 AM",
);
```

**Backend:**

```typescript
// Booking model has compound index to prevent double booking
bookingSchema.index({ mentorId: 1, bookingDate: 1, slot: 1 }, { unique: true });
```

### Database Schema

**Booking Document:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "507f191e810c19729de860ea",
  "mentorId": "507f191e810c19729de860eb",
  "bookingDate": "2026-02-05T00:00:00.000Z",
  "slot": "10:00 AM - 11:00 AM",
  "status": "confirmed",
  "duration": 60,
  "topic": "Career Guidance"
}
```

**Mentorship Session:**

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "date": "2026-02-05T00:00:00.000Z",
  "slot": "02:00 PM - 03:00 PM",
  "status": "booked",
  "meetingLink": "https://meet.google.com/abc-defg-hij"
}
```

## Important Notes

1. **Slot Format**: Always use "HH:MM AM/PM - HH:MM AM/PM" format
2. **Mentor Availability**: Stored as ranges, converted to slots on frontend
3. **Validation**: Backend should validate slot format if needed
4. **Time Zones**: Consider adding timezone handling in future
5. **Duration**: Currently hardcoded to 1 hour (60 minutes)

## Testing Checklist

- [ ] Create booking with specific slot
- [ ] Verify slot is stored correctly in database
- [ ] Check that booked slots are grayed out in calendar
- [ ] Test rescheduling with new slot
- [ ] Verify no double booking for same mentor/date/slot
- [ ] Test mentorship session booking with slot
- [ ] Check session slot is displayed correctly

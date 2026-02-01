# Time Slot System Update - Summary

## Overview

Updated the booking and mentorship system to store **specific hourly time slots** (e.g., "10:00 AM - 11:00 AM") instead of time range strings (e.g., "afternoon (1 pm - 5 pm)").

## What Changed

### ✅ Mentor Model - **NO CHANGES**

- The `preferredTime` field remains as an array of time range strings
- Example: `["morning (10 am - 12 pm)", "afternoon (1 pm - 5 pm)"]`
- This is used by mentors to define their general availability

### ✅ Frontend - **ALREADY IMPLEMENTED**

- The `BookingCalendar` component uses `getAllSlots()` utility to convert mentor's time ranges into specific hourly slots
- Example: "morning (10 am - 12 pm)" → ["10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM"]
- Users select specific hourly slots when booking

### ✅ Backend Models - **UPDATED**

#### 1. **Booking Model** (`Booking.model.ts`)

```typescript
export interface IBooking extends Document {
  // ... other fields
  slot: string; // Specific hourly slot e.g., "10:00 AM - 11:00 AM"
  proposedSlot?: string; // Specific hourly slot for rescheduling
}
```

#### 2. **Mentorship Model** (`Mentorship.model.ts`)

```typescript
interface ISession {
  _id?: string | ObjectId;
  date: Date;
  slot?: string; // NEW: Specific hourly slot e.g., "10:00 AM - 11:00 AM"
  status: SessionStatus;
  // ... other fields
}
```

### ✅ Backend Services - **UPDATED**

#### **MentorshipService** (`mentorship.service.ts`)

- **`bookSession()`**: Now accepts `slot: string` parameter
- **`rescheduleSession()`**: Now accepts `newSlot: string` parameter

```typescript
async bookSession(
    mentorshipId: string,
    userId: string,
    date: Date,
    slot: string  // NEW
): Promise<IMentorship>

async rescheduleSession(
    mentorshipId: string,
    sessionId: string,
    newDate: Date,
    newSlot: string  // NEW
): Promise<IMentorship>
```

### ✅ Backend Controllers - **UPDATED**

#### **MentorshipController** (`mentorship.controller.ts`)

- **`bookSession()`**: Extracts `slot` from request body
- **`rescheduleSession()`**: Extracts `newSlot` from request body

### ✅ DTOs - **UPDATED WITH COMMENTS**

All booking DTOs now have clarifying comments:

```typescript
export interface CreateBookingRequestDto {
  slot: string; // Specific hourly slot e.g., "10:00 AM - 11:00 AM"
}

export interface RescheduleRequestDto {
  proposedSlot: string; // Specific hourly slot e.g., "10:00 AM - 11:00 AM"
}
```

## Data Flow

1. **Mentor Setup**: Mentor sets `preferredTime: ["morning (10 am - 12 pm)"]`
2. **Frontend Display**: Calendar converts to hourly slots: `["10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM"]`
3. **User Selection**: User selects "10:00 AM - 11:00 AM"
4. **Backend Storage**: Stores exact slot "10:00 AM - 11:00 AM" in booking/session

## API Changes

### Booking a Session

**Request Body:**

```json
{
  "date": "2026-02-05T00:00:00.000Z",
  "slot": "10:00 AM - 11:00 AM"
}
```

### Rescheduling a Session

**Request Body:**

```json
{
  "sessionId": "507f1f77bcf86cd799439011",
  "newDate": "2026-02-06T00:00:00.000Z",
  "newSlot": "02:00 PM - 03:00 PM"
}
```

## Benefits

1. ✅ **Precise Scheduling**: Exact time slots are stored, no ambiguity
2. ✅ **Better Conflict Detection**: Easy to check if a specific hour is booked
3. ✅ **Improved UX**: Users see and select exact hourly slots
4. ✅ **Flexible Mentor Availability**: Mentors still use simple time ranges
5. ✅ **Type Safety**: All TypeScript types properly updated

## Migration Notes

- **Existing Data**: Old bookings/sessions without slots will have `slot: undefined`
- **Backward Compatibility**: The `slot` field is optional in sessions
- **Frontend**: Already generating correct slot format
- **No Breaking Changes**: All changes are additive

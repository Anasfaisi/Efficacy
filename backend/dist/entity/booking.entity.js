"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingEntity = void 0;
class BookingEntity {
    id;
    userId;
    mentorId;
    bookingDate;
    slot;
    status;
    duration;
    topic;
    rescheduleBy;
    proposedDate;
    proposedSlot;
    meetingLink;
    cancelReason;
    actualStartTime;
    actualEndTime;
    createdAt;
    updatedAt;
    constructor(id, userId, mentorId, bookingDate, slot, status, duration, topic, rescheduleBy, proposedDate, proposedSlot, meetingLink, cancelReason, actualStartTime, actualEndTime, createdAt, updatedAt) {
        this.id = id;
        this.userId = userId;
        this.mentorId = mentorId;
        this.bookingDate = bookingDate;
        this.slot = slot;
        this.status = status;
        this.duration = duration;
        this.topic = topic;
        this.rescheduleBy = rescheduleBy;
        this.proposedDate = proposedDate;
        this.proposedSlot = proposedSlot;
        this.meetingLink = meetingLink;
        this.cancelReason = cancelReason;
        this.actualStartTime = actualStartTime;
        this.actualEndTime = actualEndTime;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.BookingEntity = BookingEntity;
//# sourceMappingURL=booking.entity.js.map
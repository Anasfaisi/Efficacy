"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingMapper = void 0;
const booking_entity_1 = require("@/entity/booking.entity");
const mongoose_1 = require("mongoose");
const booking_status_types_1 = require("@/types/booking-status.types");
class BookingMapper {
    static fromCreateRequest(dto, bookingDate) {
        return new booking_entity_1.BookingEntity('', dto.userId, dto.mentorId, bookingDate, dto.slot, booking_status_types_1.BookingStatus.PENDING, 60, dto.topic, null, undefined, undefined, `#`);
    }
    static toEntity(doc) {
        const getPopulatedId = (field) => {
            if (!field)
                return '';
            const first = Array.isArray(field) ? field[0] : field;
            if (first && typeof first === 'object' && '_id' in first) {
                return first;
            }
            return String(first);
        };
        const userId = getPopulatedId(doc.userId);
        const mentorId = getPopulatedId(doc.mentorId);
        return new booking_entity_1.BookingEntity(doc.id, userId, mentorId, doc.bookingDate, doc.slot, doc.status, doc.duration, doc.topic, doc.rescheduleBy, doc.proposedDate, doc.proposedSlot, doc.meetingLink, doc.cancelReason, doc.actualStartTime, doc.actualEndTime, doc.createdAt, doc.updatedAt);
    }
    static toPersistence(entity) {
        const persistence = {};
        if (entity.id)
            persistence._id = new mongoose_1.Types.ObjectId(entity.id);
        const getRawId = (val) => {
            if (typeof val === 'string')
                return val;
            if (val && typeof val === 'object') {
                const v = val;
                return v.id || v._id?.toString() || String(val);
            }
            return '';
        };
        if (entity.userId) {
            const id = getRawId(entity.userId);
            if (id)
                persistence.userId = new mongoose_1.Types.ObjectId(id);
        }
        if (entity.mentorId) {
            const id = getRawId(entity.mentorId);
            if (id)
                persistence.mentorId = new mongoose_1.Types.ObjectId(id);
        }
        if (entity.bookingDate)
            persistence.bookingDate = entity.bookingDate;
        if (entity.slot)
            persistence.slot = entity.slot;
        if (entity.status)
            persistence.status = entity.status;
        if (entity.duration)
            persistence.duration = entity.duration;
        if (entity.topic !== undefined)
            persistence.topic = entity.topic;
        if (entity.rescheduleBy !== undefined)
            persistence.rescheduleBy = entity.rescheduleBy;
        if (entity.proposedDate)
            persistence.proposedDate = entity.proposedDate;
        if (entity.proposedSlot)
            persistence.proposedSlot = entity.proposedSlot;
        if (entity.meetingLink)
            persistence.meetingLink = entity.meetingLink;
        if (entity.cancelReason !== undefined)
            persistence.cancelReason = entity.cancelReason;
        if (entity.actualStartTime)
            persistence.actualStartTime = entity.actualStartTime;
        if (entity.actualEndTime)
            persistence.actualEndTime = entity.actualEndTime;
        return persistence;
    }
    static toResponseDto(entity) {
        return {
            id: entity.id,
            userId: entity.userId,
            mentorId: entity.mentorId,
            bookingDate: entity.bookingDate,
            slot: entity.slot,
            status: entity.status,
            duration: entity.duration,
            topic: entity.topic,
            rescheduleBy: entity.rescheduleBy,
            proposedDate: entity.proposedDate,
            proposedSlot: entity.proposedSlot,
            meetingLink: entity.meetingLink,
            cancelReason: entity.cancelReason,
            actualStartTime: entity.actualStartTime,
            actualEndTime: entity.actualEndTime,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
exports.BookingMapper = BookingMapper;
//# sourceMappingURL=booking.mapper.js.map
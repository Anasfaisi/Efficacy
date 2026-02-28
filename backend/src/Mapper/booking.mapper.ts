import { IBooking } from '@/models/Booking.model';
import { BookingEntity } from '@/entity/booking.entity';
import { BookingResponseDto } from '@/Dto/booking.dto';
import { UserEntity } from '@/entity/user.entity';
import { MentorEntity } from '@/entity/mentor.entity';
import { Types } from 'mongoose';
import { CreateBookingRequestDto } from '@/Dto/booking.dto';
import { BookingStatus } from '@/types/booking-status.types';

export interface BookingPersistence {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    mentorId: Types.ObjectId;
    bookingDate: Date;
    slot: string;
    status: string;
    duration: number;
    topic?: string;
    rescheduleBy?: 'user' | 'mentor' | null;
    proposedDate?: Date;
    proposedSlot?: string;
    meetingLink?: string;
    cancelReason?: string;
    actualStartTime?: Date;
    actualEndTime?: Date;
    sessionMinutes?: number;
}

export class BookingMapper {
    static fromCreateRequest(
        dto: CreateBookingRequestDto,
        bookingDate: Date
    ): BookingEntity {
        return new BookingEntity(
            '',
            dto.userId,
            dto.mentorId,
            bookingDate,
            dto.slot,
            BookingStatus.PENDING,
            60,
            dto.topic,
            null,
            undefined,
            undefined,
            `#`
        );
    }

    static toEntity(doc: IBooking): BookingEntity {
        const getPopulatedId = (
            field: Types.ObjectId | unknown
        ): string | object => {
            if (!field) return '';
            const first = Array.isArray(field) ? field[0] : field;
            if (first && typeof first === 'object' && '_id' in first) {
                return first as object;
            }
            return String(first);
        };

        const userId = getPopulatedId(doc.userId) as string | UserEntity;
        const mentorId = getPopulatedId(doc.mentorId) as string | MentorEntity;

        return new BookingEntity(
            doc.id,
            userId,
            mentorId,
            doc.bookingDate,
            doc.slot,
            doc.status,
            doc.duration,
            doc.topic,
            doc.rescheduleBy,
            doc.proposedDate,
            doc.proposedSlot,
            doc.meetingLink,
            doc.cancelReason,
            doc.actualStartTime,
            doc.actualEndTime,
            doc.sessionMinutes,
            doc.createdAt,
            doc.updatedAt
        );
    }

    static toPersistence(
        entity: Partial<BookingEntity>
    ): Partial<BookingPersistence> {
        const persistence: Partial<BookingPersistence> = {};

        if (entity.id) persistence._id = new Types.ObjectId(entity.id);

        const getRawId = (val: string | object | unknown): string => {
            if (typeof val === 'string') return val;
            if (val && typeof val === 'object') {
                const v = val as { id?: string; _id?: { toString(): string } };
                return v.id || v._id?.toString() || String(val);
            }
            return '';
        };

        if (entity.userId) {
            const id = getRawId(entity.userId);
            if (id) persistence.userId = new Types.ObjectId(id);
        }
        if (entity.mentorId) {
            const id = getRawId(entity.mentorId);
            if (id) persistence.mentorId = new Types.ObjectId(id);
        }
        if (entity.bookingDate) persistence.bookingDate = entity.bookingDate;
        if (entity.slot) persistence.slot = entity.slot;
        if (entity.status) persistence.status = entity.status;
        if (entity.duration) persistence.duration = entity.duration;
        if (entity.topic !== undefined) persistence.topic = entity.topic;
        if (entity.rescheduleBy !== undefined)
            persistence.rescheduleBy = entity.rescheduleBy;
        if (entity.proposedDate) persistence.proposedDate = entity.proposedDate;
        if (entity.proposedSlot) persistence.proposedSlot = entity.proposedSlot;
        if (entity.meetingLink) persistence.meetingLink = entity.meetingLink;
        if (entity.cancelReason !== undefined)
            persistence.cancelReason = entity.cancelReason;
        if (entity.actualStartTime)
            persistence.actualStartTime = entity.actualStartTime;
        if (entity.actualEndTime)
            persistence.actualEndTime = entity.actualEndTime;
        if (entity.sessionMinutes !== undefined)
            persistence.sessionMinutes = entity.sessionMinutes;

        return persistence;
    }

    static toResponseDto(entity: BookingEntity): BookingResponseDto {
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
            sessionMinutes: entity.sessionMinutes,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}

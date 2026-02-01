import { IBooking } from "@/models/Booking.model";
import { BookingEntity } from "@/entity/booking.entity";
import { BookingResponseDto } from "@/Dto/booking.dto";
import { Types } from "mongoose";

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
}

export class BookingMapper {
    static toEntity(doc: IBooking): BookingEntity {
        const d = doc as unknown as { 
            _id: Types.ObjectId; 
            userId: Types.ObjectId; 
            mentorId: Types.ObjectId;
        } & IBooking;

        return new BookingEntity(
            d._id.toString(),
            d.userId.toString(),
            d.mentorId.toString(),
            d.bookingDate,
            d.slot,
            d.status,
            d.duration,
            d.topic,
            d.rescheduleBy,
            d.proposedDate,
            d.proposedSlot,
            d.meetingLink,
            d.createdAt,
            d.updatedAt
        );
    }

    static toPersistence(entity: Partial<BookingEntity>): Partial<BookingPersistence> {
        const persistence: Partial<BookingPersistence> = {};
        
        if (entity.id) persistence._id = new Types.ObjectId(entity.id);
        if (entity.userId) persistence.userId = new Types.ObjectId(entity.userId);
        if (entity.mentorId) persistence.mentorId = new Types.ObjectId(entity.mentorId);
        if (entity.bookingDate) persistence.bookingDate = entity.bookingDate;
        if (entity.slot) persistence.slot = entity.slot;
        if (entity.status) persistence.status = entity.status;
        if (entity.duration) persistence.duration = entity.duration;
        if (entity.topic !== undefined) persistence.topic = entity.topic;
        if (entity.rescheduleBy !== undefined) persistence.rescheduleBy = entity.rescheduleBy;
        if (entity.proposedDate) persistence.proposedDate = entity.proposedDate;
        if (entity.proposedSlot) persistence.proposedSlot = entity.proposedSlot;
        if (entity.meetingLink) persistence.meetingLink = entity.meetingLink;
        
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
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }
}

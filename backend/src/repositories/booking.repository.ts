import { injectable } from 'inversify';
import { IBookingRepository } from './interfaces/IBooking.repository';
import Booking, { IBooking } from '../models/Booking.model';
import { BookingStatus } from '@/types/booking-status.types';
import { BookingEntity } from '@/entity/booking.entity';
import { BookingMapper } from '@/Mapper/booking.mapper';
import { Types, FilterQuery } from 'mongoose';
import { logger } from '@/utils/logMiddlewares';
@injectable()
export class BookingRepository implements IBookingRepository {
    async create(booking: BookingEntity): Promise<BookingEntity> {
        const persistence = BookingMapper.toPersistence(booking);
        const doc = await Booking.create(persistence);
        return BookingMapper.toEntity(doc);
    }

    async findById(id: string): Promise<BookingEntity | null> {
        const doc = await Booking.findById(id);
        return doc ? BookingMapper.toEntity(doc) : null;
    }

    async findByUser(
        userId: string,
        page: number,
        limit: number
    ): Promise<BookingEntity[]> {
        const skip = (page - 1) * limit;
        const docs = await Booking.find({ userId: new Types.ObjectId(userId) })
            .sort({ bookingDate: -1 })
            .skip(skip)
            .limit(limit);
        return docs.map(BookingMapper.toEntity);
    }

    async findByMentor(mentorId: string): Promise<BookingEntity[]> {
        const docs = await Booking.find({
            mentorId: new Types.ObjectId(mentorId),
        }).sort({ bookingDate: -1 });
        return docs.map(BookingMapper.toEntity);
    }

    async update(
        id: string,
        booking: Partial<BookingEntity>
    ): Promise<BookingEntity | null> {
        const persistence = BookingMapper.toPersistence(booking);
        const doc = await Booking.findByIdAndUpdate(
            id,
            { $set: persistence },
            { new: true }
        );
        return doc ? BookingMapper.toEntity(doc) : null;
    }

    async hasExistingBooking(userId: string, date: Date): Promise<boolean> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const count = await Booking.countDocuments({
            userId: new Types.ObjectId(userId),
            bookingDate: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: BookingStatus.CANCELLED },
        });
        if (count > 3) {
            return true;
        } else return false;
    }

    async isSlotAvailable(
        mentorId: string,
        date: Date,
        slot: string,
        excludeBookingId?: string
    ): Promise<boolean> {
        console.log(mentorId, date, slot, 'slot check');
        const query: FilterQuery<IBooking> = {
            mentorId: new Types.ObjectId(mentorId),
            $or: [
                {
                    bookingDate: date,
                    slot: slot,
                    status: {
                        $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
                    },
                },
                {
                    proposedDate: date,
                    proposedSlot: slot,
                    status: BookingStatus.RESCHEDULED,
                },
            ],
        };

        if (excludeBookingId) {
            query._id = { $ne: new Types.ObjectId(excludeBookingId) };
        }

        const count = await Booking.countDocuments(query);
        logger.info(count);
        return count === 0;
    }

    async countBookingsInDateRange(
        userId: string,
        startDate: Date,
        endDate: Date
    ): Promise<number> {
        return await Booking.countDocuments({
            userId: new Types.ObjectId(userId),
            bookingDate: { $gte: startDate, $lte: endDate },
            status: { $ne: BookingStatus.CANCELLED },
        });
    }

    async findPaginatedByMentor(
        mentorId: string,
        page: number,
        limit: number,
        status?: string,
        startDate?: Date,
        endDate?: Date
    ): Promise<{ bookings: BookingEntity[]; total: number }> {
        const query: FilterQuery<IBooking> = {
            mentorId: new Types.ObjectId(mentorId),
        };
        if (status && status !== 'all') {
            if (status.includes(',')) {
                query.status = { $in: status.split(',') };
            } else {
                query.status = status;
            }
        }

        if (startDate || endDate) {
            query.bookingDate = {};
            if (startDate) query.bookingDate.$gte = startDate;
            if (endDate) query.bookingDate.$lte = endDate;
        }

        const skip = (page - 1) * limit;
        const [docs, total] = await Promise.all([
            Booking.find(query)
                .sort({ bookingDate: -1 })
                .skip(skip)
                .limit(limit)
                .populate('userId'),
            Booking.countDocuments(query),
        ]);

        return {
            bookings: docs.map(BookingMapper.toEntity),
            total,
        };
    }

    async findPaginatedByUser(
        userId: string,
        page: number,
        limit: number,
        status?: string,
        startDate?: Date,
        endDate?: Date
    ): Promise<{ bookings: BookingEntity[]; total: number }> {
        const query: FilterQuery<IBooking> = {
            userId: new Types.ObjectId(userId),
        };
        if (status && status !== 'all') {
            if (status.includes(',')) {
                query.status = { $in: status.split(',') };
            } else {
                query.status = status;
            }
        }

        if (startDate || endDate) {
            query.bookingDate = {};
            if (startDate) query.bookingDate.$gte = startDate;
            if (endDate) query.bookingDate.$lte = endDate;
        }

        const skip = (page - 1) * limit;
        const [docs, total] = await Promise.all([
            Booking.find(query)
                .sort({ bookingDate: -1 })
                .skip(skip)
                .limit(limit)
                .populate('mentorId'),
            Booking.countDocuments(query),
        ]);

        return {
            bookings: docs.map(BookingMapper.toEntity),
            total,
        };
    }
}

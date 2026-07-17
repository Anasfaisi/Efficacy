"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRepository = void 0;
const inversify_1 = require("inversify");
const booking_status_types_1 = require("@/types/booking-status.types");
const booking_mapper_1 = require("@/Mapper/booking.mapper");
const mongoose_1 = require("mongoose");
const logMiddlewares_1 = require("@/utils/logMiddlewares");
const booking_model_1 = __importDefault(require("@/models/booking.model"));
let BookingRepository = class BookingRepository {
    async create(booking) {
        const persistence = booking_mapper_1.BookingMapper.toPersistence(booking);
        const doc = await booking_model_1.default.create(persistence);
        return booking_mapper_1.BookingMapper.toEntity(doc);
    }
    async findById(id) {
        const doc = await booking_model_1.default.findById(id);
        return doc ? booking_mapper_1.BookingMapper.toEntity(doc) : null;
    }
    async findByUser(userId, page, limit) {
        const skip = (page - 1) * limit;
        const docs = await booking_model_1.default.find({ userId: new mongoose_1.Types.ObjectId(userId) })
            .sort({ bookingDate: -1 })
            .skip(skip)
            .limit(limit);
        return docs.map(booking_mapper_1.BookingMapper.toEntity);
    }
    async findByMentor(mentorId) {
        const docs = await booking_model_1.default.find({
            mentorId: new mongoose_1.Types.ObjectId(mentorId),
        }).sort({ bookingDate: -1 });
        return docs.map(booking_mapper_1.BookingMapper.toEntity);
    }
    async update(id, booking) {
        const persistence = booking_mapper_1.BookingMapper.toPersistence(booking);
        const doc = await booking_model_1.default.findByIdAndUpdate(id, { $set: persistence }, { new: true });
        return doc ? booking_mapper_1.BookingMapper.toEntity(doc) : null;
    }
    async hasExistingBooking(userId, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const count = await booking_model_1.default.countDocuments({
            userId: new mongoose_1.Types.ObjectId(userId),
            bookingDate: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: booking_status_types_1.BookingStatus.CANCELLED },
        });
        if (count > 3) {
            return true;
        }
        else
            return false;
    }
    async isSlotAvailable(mentorId, date, slot, excludeBookingId) {
        console.log(mentorId, date, slot, 'slot check');
        const query = {
            mentorId: new mongoose_1.Types.ObjectId(mentorId),
            $or: [
                {
                    bookingDate: date,
                    slot: slot,
                    status: {
                        $in: [booking_status_types_1.BookingStatus.PENDING, booking_status_types_1.BookingStatus.CONFIRMED],
                    },
                },
                {
                    proposedDate: date,
                    proposedSlot: slot,
                    status: booking_status_types_1.BookingStatus.RESCHEDULED,
                },
            ],
        };
        if (excludeBookingId) {
            query._id = { $ne: new mongoose_1.Types.ObjectId(excludeBookingId) };
        }
        const count = await booking_model_1.default.countDocuments(query);
        logMiddlewares_1.logger.info(count);
        return count === 0;
    }
    async countBookingsInDateRange(userId, startDate, endDate) {
        return await booking_model_1.default.countDocuments({
            userId: new mongoose_1.Types.ObjectId(userId),
            bookingDate: { $gte: startDate, $lte: endDate },
            status: { $ne: booking_status_types_1.BookingStatus.CANCELLED },
        });
    }
    async findPaginatedByMentor(mentorId, page, limit, status, startDate, endDate) {
        const query = {
            mentorId: new mongoose_1.Types.ObjectId(mentorId),
        };
        if (status && status !== 'all') {
            if (status.includes(',')) {
                query.status = { $in: status.split(',') };
            }
            else {
                query.status = status;
            }
        }
        if (startDate || endDate) {
            query.bookingDate = {};
            if (startDate)
                query.bookingDate.$gte = startDate;
            if (endDate)
                query.bookingDate.$lte = endDate;
        }
        const skip = (page - 1) * limit;
        const [docs, total] = await Promise.all([
            booking_model_1.default.find(query)
                .sort({ bookingDate: -1 })
                .skip(skip)
                .limit(limit)
                .populate('userId'),
            booking_model_1.default.countDocuments(query),
        ]);
        return {
            bookings: docs.map(booking_mapper_1.BookingMapper.toEntity),
            total,
        };
    }
    async findPaginatedByUser(userId, page, limit, status, startDate, endDate) {
        const query = {
            userId: new mongoose_1.Types.ObjectId(userId),
        };
        if (status && status !== 'all') {
            if (status.includes(',')) {
                query.status = { $in: status.split(',') };
            }
            else {
                query.status = status;
            }
        }
        if (startDate || endDate) {
            query.bookingDate = {};
            if (startDate)
                query.bookingDate.$gte = startDate;
            if (endDate)
                query.bookingDate.$lte = endDate;
        }
        const skip = (page - 1) * limit;
        const [docs, total] = await Promise.all([
            booking_model_1.default.find(query)
                .sort({ bookingDate: -1 })
                .skip(skip)
                .limit(limit)
                .populate('mentorId'),
            booking_model_1.default.countDocuments(query),
        ]);
        return {
            bookings: docs.map(booking_mapper_1.BookingMapper.toEntity),
            total,
        };
    }
    async getMentorBookedSlots(mentorId) {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const query = {
            mentorId: new mongoose_1.Types.ObjectId(mentorId),
            $or: [
                {
                    bookingDate: { $gte: startOfDay },
                    status: {
                        $in: [booking_status_types_1.BookingStatus.PENDING, booking_status_types_1.BookingStatus.CONFIRMED],
                    },
                },
                {
                    proposedDate: { $gte: startOfDay },
                    status: booking_status_types_1.BookingStatus.RESCHEDULED,
                },
            ],
        };
        const docs = await booking_model_1.default.find(query);
        return docs.map(booking_mapper_1.BookingMapper.toEntity);
    }
};
exports.BookingRepository = BookingRepository;
exports.BookingRepository = BookingRepository = __decorate([
    (0, inversify_1.injectable)()
], BookingRepository);
//# sourceMappingURL=booking.repository.js.map
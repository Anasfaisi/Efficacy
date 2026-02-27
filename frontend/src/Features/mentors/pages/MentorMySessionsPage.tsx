import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
    Calendar,
    Clock,
    User,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { requestWrapper } from '@/utils/apiHandler';
import { bookingApi } from '@/Services/booking.api';
import type { Booking } from '@/types/booking';
import { BookingStatus } from '@/types/booking';
import SessionDetailsModal from '@/Features/mentors/components/SessionDetailsModal';
import { isBookingPast } from '@/utils/timeUtils';
import type { User as UserType } from '@/types/auth';

const MentorMySessionsPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'all'>('all');

    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mentorId, setMentorId] = useState<string>('');

    const fetchData = async () => {
        setLoading(true);
        let statusParam: string | undefined = undefined;
        if (activeTab === 'upcoming') {
            statusParam = BookingStatus.CONFIRMED;
        } else if (activeTab === 'completed') {
            statusParam = BookingStatus.COMPLETED;
        }

        const response = await requestWrapper(
            bookingApi.getMentorBookings(page, limit, statusParam)
        );

        if (response) {
            setBookings(response.bookings);
            setTotalPages(response.totalPages);

            // Hacky way to get the mentorId from one of the bookings to pass to modal
            if (response.bookings.length > 0) {
                const b = response.bookings[0];
                const mId = (b.mentorId as any)?._id || (b.mentorId as any)?.id || b.mentorId;
                if (mId) setMentorId(mId as string);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, activeTab]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => {
                            setActiveTab('all');
                            setPage(1);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            activeTab === 'all'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('upcoming');
                            setPage(1);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            activeTab === 'upcoming'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('completed');
                            setPage(1);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            activeTab === 'completed'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Completed
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/40 p-6 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            My Sessions
                        </h2>
                        <p className="text-gray-500 font-medium">
                            Manage and review all your conducted sessions.
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                        <Calendar size={24} />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50/50 rounded-3xl border border-gray-100 border-dashed">
                        <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            No {activeTab} sessions found
                        </h3>
                        <p className="text-gray-500">
                            You don't have any bookings matching this criteria.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {bookings.map((booking) => {
                            const student = booking.userId as unknown as UserType;
                            return (
                                <motion.div
                                    key={booking.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-6 bg-white rounded-3xl border border-gray-100 hover:border-indigo-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between group cursor-pointer"
                                    onClick={() => {
                                        setSelectedBooking(booking);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border border-gray-100">
                                            <span className="text-[10px] font-black uppercase text-indigo-500 leading-none mb-1">
                                                {format(new Date(booking.bookingDate), 'MMM')}
                                            </span>
                                            <span className="text-2xl font-black text-gray-900 leading-none">
                                                {format(new Date(booking.bookingDate), 'd')}
                                            </span>
                                        </div>
                                        
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-lg font-black text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                    {student?.name || "Student"}
                                                </h4>
                                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black tracking-widest uppercase ${
                                                    booking.status === BookingStatus.COMPLETED
                                                        ? 'bg-green-100 text-green-700'
                                                        : booking.status === BookingStatus.CONFIRMED && !isBookingPast(booking.bookingDate, booking.slot)
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            
                                            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5">
                                                    <Clock size={14} className="text-indigo-400" />
                                                    {booking.slot}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <User size={14} className="text-indigo-400" />
                                                    Mentorship Topic: {booking.topic || "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <button className="px-5 py-2.5 bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all">
                                            View Detail
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition-colors bg-white"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-sm font-bold text-gray-600">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition-colors bg-white"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>

            {selectedBooking && mentorId && (
                <SessionDetailsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    booking={selectedBooking}
                    menteeName={(selectedBooking.userId as unknown as UserType)?.name || "Student"}
                    mentorId={mentorId}
                />
            )}
        </div>
    );
};

export default MentorMySessionsPage;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
    Calendar,
    Clock,
    ExternalLink,
    CheckCircle2,
    ArrowLeft,
    User,
    Mail,
    Phone,
    MessageSquare,
    TrendingUp,
    AlertCircle,
    Info,
    Check,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { requestWrapper } from '@/utils/apiHandler';
import { mentorshipApi } from '@/Services/mentorship.api';
import { bookingApi } from '@/Services/booking.api';
import type { Mentorship } from '@/types/mentorship';
import type { Booking } from '@/types/booking';
import { BookingStatus } from '@/types/booking';
import MentorCalendar from '@/Features/mentors/components/MentorCalendar';
import SessionDetailsModal from '@/Features/mentors/components/SessionDetailsModal';
import { useAppDispatch } from '@/redux/hooks';
import { setCurrentConversation } from '@/redux/slices/chatSlice';
import { chatApi } from '@/Services/chat.api';

import type { User as UserType, Mentor as MentorType } from '@/types/auth';
import { isBookingPast } from '@/utils/timeUtils';

const MentorMentorshipManagementPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [mentorship, setMentorship] = useState<Mentorship | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [allMentorBookings, setAllMentorBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [sessionFilter, setSessionFilter] = useState<'Upcoming' | 'Recent' | 'All'>('Upcoming');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const fetchData = async () => {
        if (!id) return;

        const mentorshipData = await requestWrapper(
            mentorshipApi.getMentorshipById(id)
        );

        if (mentorshipData) {
            setMentorship(mentorshipData);

            const response = await requestWrapper(
                bookingApi.getMentorBookings(1, 100)
            );
            if (response) {
                const allBookings = response.bookings;
                setAllMentorBookings(allBookings);
                const studentId =
                    (mentorshipData.userId as any)?._id ||
                    (mentorshipData.userId as any)?.id ||
                    mentorshipData.userId;
                const filtered = allBookings.filter((b) => {
                    const bUserId =
                        (b.userId as unknown as UserType)?._id ||
                        (b.userId as unknown as UserType)?.id ||
                        b.userId;
                    return bUserId === studentId;
                });
                setBookings(filtered);
            }
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleUpdateBookingStatus = async (
        bookingId: string,
        status: BookingStatus
    ) => {
        const data = await requestWrapper(
            bookingApi.updateStatus({ bookingId, status }),
            `Booking ${status} successfully`
        );
        if (data) fetchData();
    };

    const handleChat = async () => {
        if (!mentorship?.userId) return;

        const userId =
            (mentorship.userId as any)?._id ||
            (mentorship.userId as any)?.id ||
            mentorship.userId;

        const conversation = await requestWrapper(chatApi.initiateChat(userId));
        if (conversation) {
            dispatch(setCurrentConversation(conversation));
            navigate('/mentor/chat');
        }
    };

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <TrendingUp
                            className="text-indigo-600 animate-pulse"
                            size={24}
                        />
                    </div>
                </div>
            </div>
        );

    if (!mentorship)
        return (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-xl">
                <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">
                    Mentorship not found
                </h2>
                <button
                    onClick={() => navigate('/mentor/sessions')}
                    className="mt-4 text-indigo-600 font-bold hover:underline"
                >
                    Back to Active Mentorships
                </button>
            </div>
        );

    const student = mentorship.userId as UserType;
    let filteredBookings = bookings;
    
    if (sessionFilter === 'Upcoming') {
        filteredBookings = bookings.filter((b) => b.status === BookingStatus.CONFIRMED);
    } else if (sessionFilter === 'Recent') {
        filteredBookings = bookings.filter((b) => b.status === BookingStatus.COMPLETED);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto pb-12"
        >
            {/* Header / Breadcrumbs */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/mentor/sessions')}
                    className="p-3 bg-white border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                        <span>Mentorships</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="text-indigo-500">
                            Mentee Profile Dashboard
                        </span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        Mentorship Dashboard
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Stats & Details */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Mentee Profile Card */}
                    <div className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-2xl shadow-gray-200/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 text-indigo-50/50 group-hover:text-indigo-100/50 transition-colors pointer-events-none">
                            <User size={180} />
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                            <div className="relative">
                                <img
                                    src={
                                        student?.profilePic ||
                                        `https://ui-avatars.com/api/?name=${student?.name}`
                                    }
                                    className="w-32 h-32 rounded-[32px] object-cover ring-8 ring-indigo-50 shadow-2xl"
                                    alt={student?.name}
                                />
                                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                    <CheckCircle2
                                        size={16}
                                        className="text-white"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900">
                                        {student?.name}
                                    </h2>
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-wider">
                                        Active Student
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                    <div className="flex items-center gap-3 text-gray-600 bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100/50">
                                        <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-500">
                                            <Mail size={16} />
                                        </div>
                                        <span className="text-sm font-semibold truncate">
                                            {student?.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100/50">
                                        <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-500">
                                            <Phone size={16} />
                                        </div>
                                        <span className="text-sm font-semibold">
                                            {student?.phone ||
                                                'No phone provided'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={handleChat}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-indigo-200 active:scale-95"
                                    >
                                        <MessageSquare size={18} />
                                        Chat
                                    </button>
                                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-900 font-black rounded-2xl hover:bg-gray-200 transition-all active:scale-95">
                                        <Info size={18} />
                                        Profile
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Progress Stats */}
                        <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-50">
                            <div>
                                <p className="text-3xl font-black text-indigo-600">
                                    {mentorship.totalSessions}
                                </p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                    Total Goal
                                </p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-green-500">
                                    {mentorship.usedSessions}
                                </p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                    Completed
                                </p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-orange-500">
                                    {mentorship.totalSessions -
                                        mentorship.usedSessions}
                                </p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                    Left to go
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Booked Sessions List */}
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-lg font-black text-gray-900">
                                {sessionFilter} Sessions
                            </h3>
                            <div className="flex bg-gray-100 p-1 rounded-xl">
                                {['Upcoming', 'Recent', 'All'].map((sf) => (
                                    <button
                                        key={sf}
                                        onClick={() => setSessionFilter(sf as any)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${sessionFilter === sf ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        {sf}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
                            <div className="divide-y divide-gray-50">
                                {filteredBookings.length === 0 ? (
                                    <div className="p-20 text-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200 text-gray-300">
                                            <Calendar size={24} />
                                        </div>
                                        <p className="text-gray-500 font-bold">
                                            No sessions scheduled for this
                                            student
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1 uppercase font-black tracking-widest">
                                            Awaiting student selection
                                        </p>
                                    </div>
                                ) : (
                                    filteredBookings.map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="p-8 hover:bg-gray-50/80 transition-all group relative"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 bg-white rounded-3xl flex flex-col items-center justify-center text-gray-900 group-hover:scale-110 transition-transform border border-gray-100 shadow-sm relative">
                                                        <span className="text-[10px] font-black uppercase text-indigo-500 leading-none mb-1">
                                                            {format(
                                                                new Date(
                                                                    booking.bookingDate
                                                                ),
                                                                'MMM'
                                                            )}
                                                        </span>
                                                        <span className="text-2xl font-black leading-none">
                                                            {format(
                                                                new Date(
                                                                    booking.bookingDate
                                                                ),
                                                                'd'
                                                            )}
                                                        </span>
                                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                                            {booking.topic ||
                                                                'Mentorship Session'}
                                                        </h4>
                                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                                            <div className="flex items-center gap-2">
                                                                <Clock
                                                                    size={14}
                                                                    className="text-indigo-400"
                                                                />
                                                                {booking.slot}
                                                            </div>
                                                            <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                                                            <div className="flex items-center gap-2">
                                                                {isBookingPast(
                                                                    booking.bookingDate,
                                                                    booking.slot
                                                                ) ? (
                                                                    <>
                                                                        <AlertCircle
                                                                            size={
                                                                                14
                                                                            }
                                                                            className="text-orange-500"
                                                                        />
                                                                        <span className="text-orange-600">
                                                                            PASSED
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <CheckCircle2
                                                                            size={
                                                                                14
                                                                            }
                                                                            className="text-green-500"
                                                                        />
                                                                        CONFIRMED
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    {booking.status ===
                                                        BookingStatus.CONFIRMED && (
                                                        <button
                                                            onClick={() =>
                                                                handleUpdateBookingStatus(
                                                                    booking.id,
                                                                    BookingStatus.COMPLETED
                                                                )
                                                            }
                                                            className="flex items-center gap-2 px-4 py-3 bg-green-50 text-green-600 text-xs font-black rounded-2xl hover:bg-green-600 hover:text-white transition-all border border-green-100"
                                                        >
                                                            <Check size={14} />
                                                            DONE
                                                        </button>
                                                    )}
                                                    {booking.status ===
                                                        BookingStatus.CONFIRMED &&
                                                        !isBookingPast(
                                                            booking.bookingDate,
                                                            booking.slot
                                                        ) && (
                                                            <button
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/meet/${booking.id}`
                                                                    )
                                                                }
                                                                className="flex items-center gap-2 px-6 py-3 bg-sky-700 text-white text-xs font-black rounded-2xl hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                                                            >
                                                                <ExternalLink
                                                                    size={14}
                                                                />
                                                                START CALL
                                                            </button>
                                                        )}
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedBooking(booking);
                                                            setIsDetailsModalOpen(true);
                                                        }}
                                                        className="px-4 py-3 bg-white border border-gray-100 rounded-2xl text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm active:scale-95 text-xs font-black uppercase tracking-widest"
                                                    >
                                                        View Detail
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Schedule & Calendar */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Mentor's Calendar View for this Mentee */}
                    <div className="bg-white rounded-[40px] p-5 border border-gray-100 shadow-2xl shadow-gray-200/50">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tighter flex items-center gap-2">
                                <Calendar
                                    size={20}
                                    className="text-indigo-600"
                                />
                                Schedule View
                            </h3>
                            <Info
                                size={18}
                                className="text-gray-300 cursor-help"
                            />
                        </div>

                        <div className="mb-6">
                            {mentorship.mentorId && (
                                <MentorCalendar
                                    mentor={mentorship.mentorId as MentorType}
                                    allBookings={allMentorBookings}
                                    currentMenteeId={
                                        (mentorship.userId as any)?._id ||
                                        (mentorship.userId as any)?.id ||
                                        mentorship.userId
                                    }
                                    selectable={false}
                                />
                            )}
                        </div>

                        <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 mt-6">
                            <p className="text-[11px] font-bold text-indigo-700 leading-relaxed">
                                <span className="font-black uppercase tracking-widest mr-1">
                                    Note:
                                </span>
                                Only sessions for this mentee are highlighted
                                here. Approved sessions are locked
                                automatically.
                            </p>
                        </div>
                    </div>
                </div>
            {selectedBooking && mentorship.mentorId && (
                <SessionDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    booking={selectedBooking}
                    menteeName={student?.name || "Student"}
                    mentorId={(mentorship.mentorId as any)?._id || (mentorship.mentorId as any)?.id || mentorship.mentorId}
                />
            )}
        </motion.div>
    );
};

export default MentorMentorshipManagementPage;

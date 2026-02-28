import React, { useEffect, useState } from 'react';
import { bookingApi } from '@/Services/booking.api';
import { mentorApi } from '@/Services/mentor.api';
import type { Booking } from '@/types/booking';
import { BookingStatus } from '@/types/booking';
import type { Mentor, User } from '@/types/auth';
import {
    Calendar as CalendarIcon,
    Clock,
    CheckCircle2,
    XCircle,
    ChevronLeft,
    ChevronRight,
    Home,
    AlertCircle,
    RotateCcw,
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import MentorCalendar from '@/Features/mentors/components/MentorCalendar';
import { requestWrapper } from '@/utils/apiHandler';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 6;

const BookingRequestsPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [mentor, setMentor] = useState<Mentor | null>(null);
    const [allMentorBookings, setAllMentorBookings] = useState<Booking[]>([]);
    const [reschedulingBookingId, setReschedulingBookingId] = useState<
        string | null
    >(null);
    const [selectedSlot, setSelectedSlot] = useState<{
        date: Date;
        slot: string;
    } | null>(null);

    const fetchBookings = async () => {
        setLoading(true);

        const data = await requestWrapper(
            bookingApi.getMentorBookings(
                currentPage,
                ITEMS_PER_PAGE,
                'pending,rescheduled'
            )
        );
        if (data) {
            setBookings(data.bookings);
            setTotalPages(data.totalPages);
            setTotalCount(data.totalCount);

            // Fetch all confirmed bookings for calendar busy slots
            const allBookingsResponse = await requestWrapper(
                bookingApi.getMentorBookings(1, 100)
            );
            if (allBookingsResponse) {
                setAllMentorBookings(allBookingsResponse.bookings);
            }

            if (!mentor) {
                const mentorData = await requestWrapper(
                    mentorApi.getMentorProfile()
                );
                if (mentorData) setMentor(mentorData);
            }
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchBookings();
    }, [currentPage]);

    const handleUpdateStatus = async (
        bookingId: string,
        status: BookingStatus
    ) => {
        const data = await requestWrapper(
            bookingApi.updateStatus({ bookingId, status }),
            `Booking ${status === BookingStatus.CONFIRMED ? 'accepted' : 'rejected'} successfully`
        );

        if (data) fetchBookings();
    };

    const handleRespondToReschedule = async (
        bookingId: string,
        approve: boolean
    ) => {
        const data = await requestWrapper(
            bookingApi.respondToReschedule(bookingId, approve),
            approve
                ? 'Reschedule accepted'
                : 'Reschedule rejected and session cancelled'
        );

        if (data) fetchBookings();
    };

    const handleProposeReschedule = async () => {
        if (!reschedulingBookingId || !selectedSlot) return;

        const data = await requestWrapper(
            bookingApi.requestReschedule({
                bookingId: reschedulingBookingId,
                proposedDate: selectedSlot.date.toISOString(),
                proposedSlot: selectedSlot.slot,
            }),
            'New time proposed to student'
        );

        if (data) {
            setReschedulingBookingId(null);
            setSelectedSlot(null);
            fetchBookings();
        }
    };

    const handleCancelWithReason = (bookingId: string) => {
        toast.custom(
            (t) => (
                <div className="bg-white p-5 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col gap-4 min-w-[320px] animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-3 text-red-600">
                        <div className="p-2 bg-red-50 rounded-xl">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <h4 className="font-black text-sm uppercase tracking-tight text-gray-900">
                                Cancel Session
                            </h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                Reason Required
                            </p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                            Cancellation Reason
                        </label>
                        <input
                            type="text"
                            id={`cancel-reason-${bookingId}`}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500/30 transition-all font-medium placeholder:text-gray-300"
                            placeholder="e.g., Unexpected conflict..."
                            autoFocus
                            onKeyDown={async (e) => {
                                if (e.key === 'Enter') {
                                    const reason = (
                                        e.target as HTMLInputElement
                                    ).value;
                                    if (!reason.trim()) {
                                        toast.error('Please provide a reason');
                                        return;
                                    }
                                    toast.dismiss(t);
                                    submitCancellation(bookingId, reason);
                                }
                            }}
                        />
                    </div>

                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={() => toast.dismiss(t)}
                            className="px-4 py-2 text-[10px] font-black uppercase text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={async () => {
                                const input = document.getElementById(
                                    `cancel-reason-${bookingId}`
                                ) as HTMLInputElement;
                                const reason = input?.value;
                                if (!reason?.trim()) {
                                    toast.error('Please provide a reason');
                                    return;
                                }
                                toast.dismiss(t);
                                submitCancellation(bookingId, reason);
                            }}
                            className="px-6 py-2 bg-black text-white text-[10px] font-black uppercase rounded-xl hover:bg-red-600 transition-all shadow-lg hover:shadow-red-200"
                        >
                            Confirm Cancellation
                        </button>
                    </div>
                </div>
            ),
            { duration: Infinity }
        );
    };

    const submitCancellation = async (bookingId: string, reason: string) => {
        const data = await requestWrapper(
            bookingApi.updateStatus({
                bookingId,
                status: BookingStatus.CANCELLED,
                cancelReason: reason,
            }),
            'Booking cancelled successfully'
        );
        if (data) fetchBookings();
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (loading && bookings.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-8 mb-20">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <Link
                    to="/mentor/dashboard"
                    className="hover:text-indigo-600 flex items-center gap-1"
                >
                    <Home size={16} />
                    Dashboard
                </Link>
                <ChevronRight size={14} />
                <span className="text-gray-900 font-semibold">
                    Booking Requests
                </span>
            </nav>

            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        Incoming Requests
                        <span className="bg-indigo-100 text-indigo-600 text-sm font-bold px-3 py-1 rounded-full">
                            {totalCount} Active
                        </span>
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Manage session requests and reschedule proposals.
                    </p>
                </div>
                {reschedulingBookingId && (
                    <button
                        onClick={() => {
                            setReschedulingBookingId(null);
                            setSelectedSlot(null);
                        }}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-all flex items-center gap-2"
                    >
                        <XCircle size={16} />
                        Cancel Rescheduling
                    </button>
                )}
            </div>

            {bookings.length === 0 ? (
                <div className="bg-white rounded-[32px] border border-gray-100 p-16 text-center shadow-lg shadow-gray-100">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CalendarIcon size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        No pending requests
                    </h3>
                    <p className="text-gray-500">
                        You're all caught up! No new booking requests to review.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Side: Requests List */}
                    <div
                        className={
                            reschedulingBookingId
                                ? 'lg:col-span-8'
                                : 'lg:col-span-12'
                        }
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {bookings.map((booking) => {
                                const isReschedule =
                                    booking.status ===
                                    BookingStatus.RESCHEDULED;
                                const isReschedulingThis =
                                    reschedulingBookingId === booking.id;

                                return (
                                    <div
                                        key={booking.id}
                                        className={`bg-white p-6 rounded-[32px] border-2 transition-all group relative ${
                                            isReschedulingThis
                                                ? 'border-indigo-600 shadow-2xl ring-4 ring-indigo-50'
                                                : isReschedule
                                                  ? 'border-orange-100 shadow-xl shadow-orange-50/50'
                                                  : 'border-gray-100 shadow-xl shadow-indigo-100/20'
                                        }`}
                                    >
                                        {isReschedule && (
                                            <div className="absolute -top-3 left-6 px-3 py-1 bg-orange-500 text-white text-[10px] font-black uppercase rounded-full shadow-lg">
                                                Reschedule Requested
                                            </div>
                                        )}

                                        <div className="flex items-start justify-between mb-6">
                                            <div
                                                className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border transition-colors ${
                                                    isReschedule
                                                        ? 'bg-orange-50 text-orange-600 border-orange-100'
                                                        : 'bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white'
                                                }`}
                                            >
                                                <span className="text-[10px] font-black uppercase tracking-tighter leading-none mb-0.5">
                                                    {format(
                                                        new Date(
                                                            isReschedule &&
                                                            booking.proposedDate
                                                                ? booking.proposedDate
                                                                : booking.bookingDate
                                                        ),
                                                        'MMM'
                                                    )}
                                                </span>
                                                <span className="text-xl font-black leading-none">
                                                    {format(
                                                        new Date(
                                                            isReschedule &&
                                                            booking.proposedDate
                                                                ? booking.proposedDate
                                                                : booking.bookingDate
                                                        ),
                                                        'd'
                                                    )}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div
                                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full mb-1 ${
                                                        isReschedule
                                                            ? 'bg-orange-50 text-orange-600'
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}
                                                >
                                                    <Clock size={12} />
                                                    <span className="text-xs font-bold">
                                                        {isReschedule &&
                                                        booking.proposedSlot
                                                            ? booking.proposedSlot
                                                            : booking.slot}
                                                    </span>
                                                </div>
                                                {isReschedule && (
                                                    <p className="text-[10px] text-gray-400 font-bold line-through">
                                                        Was:{' '}
                                                        {format(
                                                            new Date(
                                                                booking.bookingDate
                                                            ),
                                                            'MMM d'
                                                        )}{' '}
                                                        at {booking.slot}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <h4 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">
                                                {booking.topic ||
                                                    'Mentorship Session'}
                                            </h4>
                                            <p className="text-xs text-gray-400 font-medium">
                                                Session ID:{' '}
                                                {booking.id
                                                    .slice(-6)
                                                    .toUpperCase()}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-2xl">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase">
                                                {(
                                                    booking.userId as unknown as User
                                                )._id?.slice(0, 1)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-gray-900 truncate">
                                                    Student Request
                                                </p>
                                                <p className="text-[10px] text-gray-500 font-medium">
                                                    ID:{' '}
                                                    {(
                                                        booking.userId as unknown as User
                                                    )._id?.slice(-6)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {isReschedule ? (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handleRespondToReschedule(
                                                                booking.id,
                                                                true
                                                            )
                                                        }
                                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-sky-600 text-white text-xs font-black rounded-xl hover:bg-green-600 transition-all active:scale-95 shadow-lg shadow-gray-200"
                                                    >
                                                        <CheckCircle2
                                                            size={16}
                                                        />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setReschedulingBookingId(
                                                                booking.id
                                                            )
                                                        }
                                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 text-xs font-black rounded-xl hover:bg-black hover:text-white transition-all active:scale-95"
                                                    >
                                                        <RotateCcw size={16} />
                                                        Propose Other
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleCancelWithReason(
                                                                booking.id
                                                            )
                                                        }
                                                        className="p-3 bg-white border border-gray-200 text-red-400 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all active:scale-95"
                                                        title="Reject Request"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handleUpdateStatus(
                                                                booking.id,
                                                                BookingStatus.CONFIRMED
                                                            )
                                                        }
                                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-black text-white text-xs font-black rounded-xl hover:bg-green-600 transition-all active:scale-95"
                                                    >
                                                        <CheckCircle2
                                                            size={16}
                                                        />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setReschedulingBookingId(
                                                                booking.id
                                                            )
                                                        }
                                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-500 text-xs font-black rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-95"
                                                    >
                                                        <RotateCcw size={16} />
                                                        Reschedule
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleCancelWithReason(
                                                                booking.id
                                                            )
                                                        }
                                                        className="p-3 bg-white border border-gray-200 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all active:scale-95"
                                                        title="Reject Request"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-12">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <div className="flex items-center gap-2">
                                    {Array.from(
                                        { length: Math.min(5, totalPages) },
                                        (_, i) => {
                                            let pageNum = currentPage;
                                            if (currentPage <= 3)
                                                pageNum = i + 1;
                                            else if (
                                                currentPage >=
                                                totalPages - 2
                                            )
                                                pageNum = totalPages - 4 + i;
                                            else pageNum = currentPage - 2 + i;

                                            if (
                                                pageNum < 1 ||
                                                pageNum > totalPages
                                            )
                                                return null;

                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() =>
                                                        goToPage(pageNum)
                                                    }
                                                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                                                        currentPage === pageNum
                                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 transform scale-110'
                                                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        }
                                    )}
                                </div>

                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Calendar View (Only when rescheduling) */}
                    {reschedulingBookingId && (
                        <div className="lg:col-span-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-white rounded-[40px] p-8 border-2 border-indigo-600 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <CalendarIcon size={120} />
                                </div>

                                <div className="flex items-center justify-between mb-8 relative z-10">
                                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2">
                                        <RotateCcw
                                            size={20}
                                            className="text-indigo-600"
                                        />
                                        Pick New Time
                                    </h3>
                                    <AlertCircle
                                        size={18}
                                        className="text-gray-300 cursor-help"
                                    />
                                </div>

                                <div className="mb-6 relative z-10">
                                    {mentor && (
                                        <MentorCalendar
                                            mentor={mentor}
                                            allBookings={allMentorBookings}
                                            currentMenteeId={
                                                bookings.find(
                                                    (b) =>
                                                        b.id ===
                                                        reschedulingBookingId
                                                )?.userId || ''
                                            }
                                            selectable={true}
                                            onSelectSlot={(date, slot) =>
                                                setSelectedSlot({ date, slot })
                                            }
                                        />
                                    )}
                                </div>

                                {selectedSlot ? (
                                    <div className="mt-8 pt-8 border-t border-gray-100 space-y-4 animate-in fade-in slide-in-from-bottom-4 relative z-10">
                                        <div className="p-4 bg-green-50 rounded-[24px] border border-green-100 flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-black text-green-700">
                                                    {format(
                                                        selectedSlot.date,
                                                        'EEEE, MMM d'
                                                    )}
                                                </p>
                                                <p className="text-xs font-bold text-green-600">
                                                    {selectedSlot.slot}
                                                </p>
                                            </div>
                                            <button
                                                onClick={
                                                    handleProposeReschedule
                                                }
                                                className="px-6 py-3 bg-green-600 text-white text-[10px] font-black uppercase rounded-2xl shadow-lg shadow-green-200 hover:bg-black transition-all"
                                            >
                                                Propose
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-8 p-6 border-2 border-dashed border-gray-100 rounded-[32px] text-center relative z-10">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                                            Click a free slot on the calendar
                                        </p>
                                    </div>
                                )}

                                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 mt-6 relative z-10">
                                    <p className="text-[11px] font-bold text-indigo-700 leading-relaxed">
                                        <span className="font-black uppercase tracking-widest mr-1">
                                            Pro Tip:
                                        </span>
                                        Proposing a new time will inform the
                                        student. Once they accept, the session
                                        will be updated.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BookingRequestsPage;

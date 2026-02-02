import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { mentorshipApi } from '@/Services/mentorship.api';
import type { Mentorship } from '@/types/mentorship';
import { MentorshipStatus } from '@/types/mentorship';
import Sidebar from '../../home/layouts/Sidebar';
import Navbar from '../../home/layouts/Navbar';
import Breadcrumbs from '@/Components/common/Breadcrumbs';
import {
    Calendar,
    Clock,
    ExternalLink,
    AlertCircle,
    MessageSquare,
    Info,
    ArrowLeft,
    Video,
} from 'lucide-react';
import { toast } from 'sonner';
import BookingCalendar from '../components/BookingCalendar';
import BookingModal from '../components/BookingModal';
import { bookingApi } from '@/Services/booking.api';
import type { Booking } from '@/types/booking';
import {
    checkVideoStatus,
    onHostOnline,
    offVideoEvents,
} from '@/Services/socket/socketService';
import { useAppSelector } from '@/redux/hooks';
import type { Mentor } from '@/types/auth';

const MentorshipManagementPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAppSelector((state) => state.auth);
    const isMentor = currentUser?.role === 'mentor'; // OR location.pathname.includes('/mentor/')

    const [mentorship, setMentorship] = useState<Mentorship | null>(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    // New Booking State
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [existingBookings, setExistingBookings] = useState<Booking[]>([]);

    // Session State
    const [nextSession, setNextSession] = useState<Booking | null>(null);
    const [isSessionActive, setIsSessionActive] = useState(false);

    const fetchData = async () => {
        if (!id) return;
        try {
            const data = await mentorshipApi.getMentorshipById(id);
            console.log(data, 'data mentorship magnamentpage');
            setMentorship(data);
            console.log(
                mentorship,
                'mentorship from mentorshipmanagnement apge'
            );
            const bookings = await bookingApi.getUserBookings();

            // Filter bookings for this mentorship/mentor
            const mentor = data.mentorId as Mentor;
            const relevantBookings = bookings.filter(
                (b) => b.mentorId === (mentor?._id || mentor?.id)
            );
            setExistingBookings(relevantBookings);

            // Find next session
            const upcoming = relevantBookings
                .filter((b) => b.status === 'confirmed')
                .sort(
                    (a, b) =>
                        new Date(a.bookingDate).getTime() -
                        new Date(b.bookingDate).getTime()
                )
                .find((b) => {
                    const sessionDate = new Date(b.bookingDate);

                    return (
                        sessionDate.getTime() > Date.now() - 24 * 60 * 60 * 1000
                    ); // rough check
                });

            // if (upcoming) {
            //     setNextSession(upcoming);
            //     // Check if session is already active
            //     const active = await checkVideoStatus(upcoming.id);
            //     setIsSessionActive(active);
            // }
        } catch (error) {
            console.error('Failed to fetch mentorship:', error);
            toast.error('Failed to load mentorship details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Listen for User/Host online
        onHostOnline(() => {
            if (!isMentor) {
                setIsSessionActive(true);
                toast.success(
                    'Mentor has started the session! You can join now.'
                );
            }
        });

        return () => {
            offVideoEvents();
        };
    }, [id, isMentor]);

    const handleJoinSession = () => {
        if (!nextSession) return;
        navigate(`/meet/${nextSession.id}`);
    };

    const isSessionStartable = () => {
        if (!nextSession) return false;

        return true;
    };

    const handleConfirm = async (confirm: boolean) => {
        if (!id) return;
        setIsProcessing(true);
        try {
            await mentorshipApi.confirmSuggestion(id, confirm);
            toast.success(
                confirm
                    ? 'Mentorship confirmed! Proceed to payment.'
                    : 'Mentorship request rejected.'
            );
            fetchData();
        } catch (error: unknown) {
            toast.error(
                (error as { response?: { data?: { message?: string } } })
                    .response?.data?.message || 'Failed to process request'
            );
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePayment = async () => {
        if (!id) return;
        setIsProcessing(true);
        try {
            const { sessionUrl } =
                await mentorshipApi.createMentorshipCheckoutSession(
                    id,
                    `${window.location.origin}/success`,
                    `${window.location.origin}/failed`
                );

            if (sessionUrl) window.location.href = sessionUrl;
        } catch (error) {
            toast.error('Failed to initiate payment');
            setIsProcessing(false);
        }
    };

    const handleSelectSlot = (date: Date, slot: string) => {
        setSelectedDate(date);
        setSelectedSlot(slot);
        setIsBookingModalOpen(true);
    };

    const handleConfirmBooking = async (topic: string) => {
        const mentor = mentorship?.mentorId as Mentor;
        if (!mentor?._id && !mentor?.id) return;
        if (!selectedDate || !selectedSlot) return;

        try {
            await bookingApi.createBooking({
                mentorId: (mentor._id || mentor.id) as string,
                bookingDate: selectedDate.toISOString(),
                slot: selectedSlot,
                topic,
            });
            fetchData();
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 'Failed to book session'
            );
            throw error; // Re-throw for modal handling
        }
    };

    const handleComplete = async () => {
        if (!id) return;
        try {
            await mentorshipApi.completeMentorship(id, 'user');
            toast.success(
                'You have confirmed the completion of this mentorship!'
            );
            fetchData();
        } catch (error: any) {
            toast.error(error.message || 'Failed to confirm completion');
        }
    };

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7F00FF]"></div>
            </div>
        );

    if (!mentorship)
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <AlertCircle size={48} className="text-gray-300 mb-4" />
                <h2 className="text-xl font-bold text-gray-900">
                    Mentorship not found
                </h2>
                <button
                    onClick={() => navigate('/home')}
                    className="mt-4 text-[#7F00FF] font-bold"
                >
                    Return Home
                </button>
            </div>
        );

    if (mentorship.status === MentorshipStatus.REJECTED) {
        return (
            <div className="min-h-screen flex bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Navbar />
                    <main className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
                        <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl shadow-red-100 border border-red-50 text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle
                                    className="text-red-500"
                                    size={32}
                                />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 mb-2">
                                Request Rejected
                            </h2>
                            <p className="text-gray-500 mb-6 font-medium">
                                The mentor has reviewed your request but decided
                                not to proceed at this time.
                            </p>

                            <div className="bg-gray-50 rounded-2xl p-6 text-left mb-6">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                                    Reason provided
                                </h3>
                                <p className="text-gray-800 font-medium">
                                    {mentorship.rejectionReason ||
                                        'No specific reason provided.'}
                                </p>

                                {mentorship.mentorSuggestedStartDate && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                                            You can re-apply after
                                        </h3>
                                        <p className="text-[#7F00FF] font-bold">
                                            {new Date(
                                                mentorship.mentorSuggestedStartDate
                                            ).toLocaleDateString(undefined, {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => navigate('/home')}
                                className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors"
                            >
                                Back to Home
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    const remainingSessions =
        mentorship.totalSessions - mentorship.usedSessions;

    return (
        <div className="min-h-screen flex bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center gap-4 mb-8">
                            <button
                                onClick={() => navigate('/home')}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <ArrowLeft
                                    size={20}
                                    className="text-gray-600"
                                />
                            </button>
                            <div>
                                <Breadcrumbs />
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                                    Mentorship Dashboard
                                </h1>
                            </div>
                        </div>

                        {/* LIVE SESSION CARD */}
                        {nextSession && (
                            <div className="mb-8 w-full bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#7F00FF] opacity-10 blur-[80px] rounded-full group-hover:opacity-20 transition-opacity"></div>
                                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="flex h-3 w-3 relative">
                                                <span
                                                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSessionActive ? 'bg-green-400' : 'bg-yellow-400'}`}
                                                ></span>
                                                <span
                                                    className={`relative inline-flex rounded-full h-3 w-3 ${isSessionActive ? 'bg-green-500' : 'bg-yellow-500'}`}
                                                ></span>
                                            </span>
                                            <span className="text-xs font-black uppercase tracking-widest text-white/60">
                                                {isSessionActive
                                                    ? 'Happening Now'
                                                    : 'Upcoming Session'}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-black mb-1">
                                            {nextSession.topic ||
                                                'Mentorship Session'}
                                        </h2>
                                        <p className="text-white/60 text-sm">
                                            {format(
                                                new Date(
                                                    nextSession.bookingDate
                                                ),
                                                'MMMM d, yyyy'
                                            )}{' '}
                                            • {nextSession.slot}
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleJoinSession}
                                        disabled={!isMentor && !isSessionActive}
                                        className={`px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-lg
                                            ${
                                                isMentor
                                                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                                                    : isSessionActive
                                                      ? 'bg-[#7F00FF] text-white hover:bg-[#6c00db] shadow-[#7F00FF]/30'
                                                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                                            }
                                        `}
                                    >
                                        <Video size={20} />
                                        {isMentor
                                            ? 'Start Session'
                                            : isSessionActive
                                              ? 'Join Session'
                                              : 'Waiting for Host...'}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Progress & Details */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Session Usage Chart / Card */}
                                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 mb-1">
                                                Session Usage
                                            </h2>
                                            <p className="text-gray-500 text-sm">
                                                Track your progress during this
                                                month
                                            </p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="text-center">
                                                <p className="text-2xl font-black text-[#7F00FF]">
                                                    {mentorship.totalSessions}
                                                </p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    Total
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-black text-green-500">
                                                    {mentorship.usedSessions}
                                                </p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    Used
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-black text-orange-500">
                                                    {remainingSessions}
                                                </p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    Left
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase">
                                            <span>Progress</span>
                                            <span>
                                                {Math.round(
                                                    (mentorship.usedSessions /
                                                        mentorship.totalSessions) *
                                                        100
                                                )}
                                                % Complete
                                            </span>
                                        </div>
                                        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#7F00FF] to-[#E100FF] rounded-full transition-all duration-1000"
                                                style={{
                                                    width: `${(mentorship.usedSessions / mentorship.totalSessions) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Sessions List */}
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            My Booked Sessions
                                        </h3>
                                        <span className="px-3 py-1 bg-[#7F00FF]/10 text-[#7F00FF] text-[10px] font-black rounded-lg uppercase tracking-wider">
                                            Booking Engine
                                        </span>
                                    </div>
                                    <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
                                        {existingBookings.length === 0 ? (
                                            <div className="p-12 text-center">
                                                <Calendar
                                                    size={48}
                                                    className="mx-auto text-gray-200 mb-4"
                                                />
                                                <p className="text-gray-500 font-medium">
                                                    No sessions booked yet
                                                </p>
                                                <p className="text-gray-400 text-xs mt-1">
                                                    Book your first session
                                                    above
                                                </p>
                                            </div>
                                        ) : (
                                            existingBookings.map(
                                                (booking, idx) => (
                                                    <div
                                                        key={booking.id}
                                                        className="p-6 hover:bg-gray-50 transition-colors flex flex-col gap-4 group"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-[#7F00FF]/5 rounded-2xl flex flex-col items-center justify-center text-[#7F00FF]">
                                                                    <span className="text-[10px] font-black uppercase">
                                                                        {format(
                                                                            new Date(
                                                                                booking.bookingDate
                                                                            ),
                                                                            'MMM'
                                                                        )}
                                                                    </span>
                                                                    <span className="text-lg font-black leading-none">
                                                                        {format(
                                                                            new Date(
                                                                                booking.bookingDate
                                                                            ),
                                                                            'd'
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-gray-900">
                                                                        {booking.topic ||
                                                                            `Session #${idx + 1}`}
                                                                    </p>
                                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                        <Clock
                                                                            size={
                                                                                12
                                                                            }
                                                                        />
                                                                        <span>
                                                                            {
                                                                                booking.slot
                                                                            }
                                                                        </span>
                                                                        <span className="mx-1">
                                                                            •
                                                                        </span>
                                                                        <span
                                                                            className={`capitalize font-bold 
                                                                        ${
                                                                            booking.status ===
                                                                            'confirmed'
                                                                                ? 'text-green-500'
                                                                                : booking.status ===
                                                                                    'rescheduled'
                                                                                  ? 'text-orange-500'
                                                                                  : booking.status ===
                                                                                      'cancelled'
                                                                                    ? 'text-red-500'
                                                                                    : 'text-gray-400'
                                                                        }`}
                                                                        >
                                                                            {
                                                                                booking.status
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {booking.status ===
                                                                    'confirmed' &&
                                                                    booking.meetingLink && (
                                                                        <a
                                                                            href={
                                                                                booking.meetingLink
                                                                            }
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="p-3 bg-white border border-gray-100 rounded-xl text-[#7F00FF] hover:bg-[#7F00FF] hover:text-white transition-all shadow-sm"
                                                                        >
                                                                            <ExternalLink
                                                                                size={
                                                                                    18
                                                                                }
                                                                            />
                                                                        </a>
                                                                    )}
                                                            </div>
                                                        </div>

                                                        {booking.status ===
                                                            'rescheduled' && (
                                                            <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                                <div className="flex items-center gap-3">
                                                                    <AlertCircle
                                                                        size={
                                                                            18
                                                                        }
                                                                        className="text-orange-500"
                                                                    />
                                                                    <div>
                                                                        <p className="text-xs font-black text-orange-800 uppercase tracking-widest">
                                                                            Reschedule
                                                                            Requested
                                                                        </p>
                                                                        <p className="text-sm font-medium text-orange-900">
                                                                            Proposed:{' '}
                                                                            {format(
                                                                                new Date(
                                                                                    booking.proposedDate!
                                                                                ),
                                                                                'MMM d'
                                                                            )}{' '}
                                                                            at{' '}
                                                                            {
                                                                                booking.proposedSlot
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                {booking.rescheduleBy !==
                                                                    (location.pathname.includes(
                                                                        '/mentor/'
                                                                    )
                                                                        ? 'mentor'
                                                                        : 'user') && (
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            onClick={() =>
                                                                                bookingApi
                                                                                    .respondToReschedule(
                                                                                        booking.id,
                                                                                        true
                                                                                    )
                                                                                    .then(
                                                                                        fetchData
                                                                                    )
                                                                            }
                                                                            className="px-4 py-2 bg-orange-500 text-white text-xs font-black rounded-lg hover:bg-orange-600 transition-all"
                                                                        >
                                                                            Approve
                                                                        </button>
                                                                        <button
                                                                            onClick={() =>
                                                                                bookingApi
                                                                                    .respondToReschedule(
                                                                                        booking.id,
                                                                                        false
                                                                                    )
                                                                                    .then(
                                                                                        fetchData
                                                                                    )
                                                                            }
                                                                            className="px-4 py-2 bg-white border border-orange-200 text-orange-500 text-xs font-black rounded-lg hover:bg-orange-50 transition-all"
                                                                        >
                                                                            Reject
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Book & Info */}
                            <div className="space-y-8">
                                {/* Action Cards based on Status */}
                                {mentorship.status ===
                                    MentorshipStatus.MENTOR_ACCEPTED && (
                                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            Application Accepted!
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            The mentor has accepted your
                                            request.
                                            {mentorship.mentorSuggestedStartDate && (
                                                <span className="block mt-2 font-medium text-[#7F00FF]">
                                                    Note: Suggested Start Date:{' '}
                                                    {new Date(
                                                        mentorship.mentorSuggestedStartDate
                                                    ).toLocaleDateString()}
                                                </span>
                                            )}
                                        </p>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() =>
                                                    handleConfirm(true)
                                                }
                                                disabled={isProcessing}
                                                className="flex-1 py-3 bg-[#7F00FF] text-white font-black rounded-xl hover:bg-[#6c00db] transition-colors disabled:opacity-50"
                                            >
                                                Confirm & Pay
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleConfirm(false)
                                                }
                                                disabled={isProcessing}
                                                className="flex-1 py-3 bg-red-50 text-red-600 font-black rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {mentorship.status ===
                                    MentorshipStatus.PAYMENT_PENDING && (
                                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            Payment Required
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            Please complete the payment to
                                            activate your mentorship.
                                        </p>
                                        <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-xl">
                                            <span className="text-sm font-medium text-gray-600">
                                                Total Amount
                                            </span>
                                            <span className="text-xl font-black text-gray-900">
                                                ₹{mentorship.amount}
                                            </span>
                                        </div>
                                        <button
                                            onClick={handlePayment}
                                            disabled={isProcessing}
                                            className="w-full py-3 bg-[#7F00FF] text-white font-black rounded-xl hover:bg-[#6c00db] transition-colors disabled:opacity-50"
                                        >
                                            {isProcessing
                                                ? 'Processing...'
                                                : 'Pay Now'}
                                        </button>
                                    </div>
                                )}

                                {/* Book New Session */}
                                {remainingSessions > 0 &&
                                    mentorship.status ===
                                        MentorshipStatus.ACTIVE && (
                                        <div className="space-y-6">
                                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                                                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                                                    <Calendar
                                                        size={20}
                                                        className="text-[#7F00FF]"
                                                    />
                                                    Schedule a Session
                                                </h3>
                                                {mentorship.mentorId && (
                                                    <BookingCalendar
                                                        mentor={
                                                            mentorship.mentorId as Mentor
                                                        }
                                                        onSelectSlot={
                                                            handleSelectSlot
                                                        }
                                                        bookedSlots={existingBookings.map(
                                                            (b) => ({
                                                                date: b.bookingDate,
                                                                slot: b.slot,
                                                            })
                                                        )}
                                                    />
                                                )}
                                                <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 font-medium px-2">
                                                    <Info size={14} />
                                                    <span>
                                                        You have{' '}
                                                        {remainingSessions}{' '}
                                                        sessions remaining for
                                                        this month.
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                <BookingModal
                                    isOpen={isBookingModalOpen}
                                    onClose={() => setIsBookingModalOpen(false)}
                                    onConfirm={handleConfirmBooking}
                                    date={selectedDate}
                                    slot={selectedSlot}
                                    mentorName={
                                        (mentorship.mentorId as Mentor)?.name ||
                                        'Mentor'
                                    }
                                />

                                {/* Mentor Profile Mini */}
                                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
                                        Your Mentor
                                    </h3>
                                    <div className="flex items-center gap-4 mb-6">
                                        <img
                                            src={
                                                (mentorship.mentorId as Mentor)
                                                    ?.profilePic ||
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent((mentorship.mentorId as Mentor)?.name || 'Mentor')}`
                                            }
                                            className="w-16 h-16 rounded-2xl object-cover"
                                            alt=""
                                        />
                                        <div>
                                            <h4 className="font-bold text-gray-900">
                                                {
                                                    (
                                                        mentorship.mentorId as Mentor
                                                    )?.name
                                                }
                                            </h4>
                                            <p className="text-xs text-[#7F00FF] font-semibold">
                                                {(mentorship.mentorId as Mentor)
                                                    ?.expertise || 'Mentor'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-6 border-t border-gray-50">
                                        <button className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                                            <MessageSquare size={18} /> Chat
                                            with Mentor
                                        </button>
                                        <button className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                                            <Info size={18} /> View Policy
                                        </button>
                                    </div>
                                </div>

                                {/* Completion Section */}
                                {mentorship.status ===
                                    MentorshipStatus.ACTIVE &&
                                    mentorship.usedSessions >= 7 && (
                                        <div className="bg-green-50 rounded-3xl p-6 border border-green-100">
                                            <h3 className="text-green-800 font-bold mb-2">
                                                Finish Mentorship?
                                            </h3>
                                            <p className="text-sm text-green-700 mb-4 leading-relaxed">
                                                If you've completed your
                                                sessions and goals, you can mark
                                                this mentorship as complete.
                                            </p>
                                            <button
                                                onClick={handleComplete}
                                                disabled={
                                                    mentorship.userConfirmedCompletion
                                                }
                                                className="w-full py-3 bg-green-600 text-white font-black rounded-xl hover:bg-green-700 active:scale-95 transition-all disabled:opacity-50"
                                            >
                                                {mentorship.userConfirmedCompletion
                                                    ? 'Awaiting Mentor Confirmation'
                                                    : 'Confirm Completion'}
                                            </button>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MentorshipManagementPage;

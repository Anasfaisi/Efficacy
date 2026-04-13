import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { mentorshipApi } from '@/Services/mentorship.api';
import type { Mentorship } from '@/types/mentorship';
import { MentorshipStatus } from '@/types/mentorship';
import Sidebar from '../../home/layouts/Sidebar';
import Navbar from '../../home/layouts/Navbar';
import Breadcrumbs from '@/Components/common/Breadcrumbs';
import { requestWrapper } from '@/utils/apiHandler';
import { MentorshipMessages } from '../constants/mentorshipMessages.constants';
import {
    Calendar,
    Clock,
    AlertCircle,
    MessageSquare,
    Info,
    ArrowLeft,
    Video,
    XCircle,
    CheckCircle2,
} from 'lucide-react';
import ReviewModal from '../components/ReviewModal';
import { reviewApi } from '@/Services/review.api';
import { toast } from 'sonner';
import BookingCalendar from '../components/BookingCalendar';
import BookingModal from '../components/BookingModal';
import RescheduleModal from '../components/RescheduleModal';
import CancelMentorshipModal from '../components/CancelMentorshipModal';
import { bookingApi } from '@/Services/booking.api';
import type { Booking } from '@/types/booking';
import {
    checkVideoStatus,
    onHostOnline,
    offVideoEvents,
} from '@/Services/socket/socketService';
import { useAppSelector } from '@/redux/hooks';
import type { Mentor } from '@/types/auth';
import { isBookingPast, canReschedule } from '@/utils/timeUtils';
import { BookingStatus } from '@/types/booking';

const MentorshipManagementPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentUser } = useAppSelector((state) => state.auth);
    const isMentor = currentUser?.role === 'mentor';

    const [mentorship, setMentorship] = useState<Mentorship | null>(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [existingBookings, setExistingBookings] = useState<Booking[]>([]);

    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [rescheduleData, setRescheduleData] = useState<{
        id: string;
        date: string;
        slot: string;
    } | null>(null);

    const [nextSession, setNextSession] = useState<Booking | null>(null);
    const [isSessionActive, setIsSessionActive] = useState(false);

    const [selectedBookingForReview, setSelectedBookingForReview] =
        useState<Booking | null>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    const fetchData = async () => {
        if (!id) return;
        const data = await requestWrapper(mentorshipApi.getMentorshipById(id));
        if (data) {
            setMentorship(data);
            const bookingData = await requestWrapper(
                bookingApi.getUserBookings(1, 100)
            );

            if (bookingData?.bookings) {
                const bookings = bookingData.bookings;
                console.log(bookings, 'bookings');
                const mentor = data.mentorId as Mentor;

                const relevantBookings = bookings.filter(
                    (b) =>
                        (b.mentorId as unknown as Mentor)._id ===
                        (mentor?._id || mentor?.id)
                );
                setExistingBookings(relevantBookings);

                const upcoming = relevantBookings
                    .filter((b: Booking) => b.status === 'confirmed')
                    .sort(
                        (a: Booking, b: Booking) =>
                            new Date(a.bookingDate).getTime() -
                            new Date(b.bookingDate).getTime()
                    )
                    .find((b: Booking) => {
                        const sessionDate = new Date(b.bookingDate);
                        return (
                            sessionDate.getTime() >
                            Date.now() - 24 * 60 * 60 * 1000
                        );
                    });

                if (upcoming) {
                    setNextSession(upcoming);
                    const active = await checkVideoStatus(upcoming.id);
                    setIsSessionActive(active);
                }
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        onHostOnline(() => {
            if (!isMentor) {
                console.log(
                    isMentor,
                    isSessionActive,
                    'isMentor,isSessionActive'
                );
                setIsSessionActive(true);
                toast.success(
                    MentorshipMessages.MENTOR_STARTED_SESSION
                );
            }
        });

        return () => {
            offVideoEvents();
        };
    }, [id, isMentor]);

    const handleJoinSession = () => {
        console.log('sdfkjdsfjkdj');
        if (!nextSession) return;
        navigate(`/meet/${nextSession.id}`);
    };

    const isSessionStartable = () => {
        if (!nextSession) return false;
        return (
            nextSession.status === 'confirmed' &&
            !isBookingPast(nextSession.bookingDate, nextSession.slot)
        );
    };

    const handleConfirm = async (confirm: boolean) => {
        if (!id) return;
        setIsProcessing(true);
        const data = await requestWrapper(
            mentorshipApi.confirmSuggestion(id, confirm),
            confirm
                ? MentorshipMessages.MENTORSHIP_CONFIRMED
                : MentorshipMessages.MENTORSHIP_REJECTED
        );
        if (data) fetchData();
        setIsProcessing(false);
    };

    const handlePayment = async () => {
        if (!id) return;
        setIsProcessing(true);
        const data = await requestWrapper(
            mentorshipApi.createMentorshipCheckoutSession(
                id,
                `${window.location.origin}/success`,
                `${window.location.origin}/failed`
            )
        );
        if (data?.sessionUrl) {
            window.location.href = data.sessionUrl;
        } else {
            setIsProcessing(false);
        }
    };

    const handleSelectSlot = (date: Date, slot: string) => {
        console.log(date,slot)
        setSelectedDate(date);
        setSelectedSlot(slot);
        setIsBookingModalOpen(true);
    };

    const handleConfirmBooking = async (topic: string): Promise<void> => {
        const mentor = mentorship?.mentorId as Mentor;
        if (!mentor?._id && !mentor?.id) {
            toast.error(MentorshipMessages.MENTOR_INFO_MISSING);
            throw new Error(MentorshipMessages.MENTOR_INFO_MISSING);
        }
        if (!selectedDate || !selectedSlot) {
            toast.error(MentorshipMessages.DATE_OR_SLOT_MISSING);
            throw new Error(MentorshipMessages.DATE_OR_SLOT_MISSING);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            toast.error(MentorshipMessages.CANNOT_BOOK_PAST_DATE);
            throw new Error(MentorshipMessages.CANNOT_BOOK_PAST_DATE);
        }

        const data = await requestWrapper(
            bookingApi.createBooking({
                mentorId: (mentor._id || mentor.id) as string,
                bookingDate: selectedDate.toISOString(),
                slot: selectedSlot,
                topic,
            }),
            MentorshipMessages.SESSION_BOOKED
        );

        if (!data) {
            throw new Error('Booking failed');
        }

        fetchData();
    };

    const handleComplete = async () => {
        if (!id) return;
        const data = await requestWrapper(
            mentorshipApi.completeMentorship(id, 'user'),
            MentorshipMessages.MENTORSHIP_COMPLETED
        );
        if (data) fetchData();
    };

    const handleRequestReschedule = (bookingId: string) => {
        const booking = existingBookings.find((b) => b.id === bookingId);
        if (booking) {
            setRescheduleData({
                id: bookingId,
                date: booking.bookingDate
                    ? format(new Date(booking.bookingDate), 'MMM do, yyyy')
                    : 'N/A',
                slot: booking.slot,
            });
            setIsRescheduleModalOpen(true);
        }
    };

    const confirmReschedule = async () => {
        if (!rescheduleData) throw new Error('No reschedule data');
        const data = await requestWrapper(
            bookingApi.updateStatus({
                bookingId: rescheduleData.id,
                status: BookingStatus.RESCHEDULED,
            }),
            MentorshipMessages.RESCHEDULE_SENT
        );
        if (!data) throw new Error('Reschedule failed');
        fetchData();
    };

    const handleRespondToReschedule = async (
        bookingId: string,
        approve: boolean
    ) => {
        const data = await requestWrapper(
            bookingApi.respondToReschedule(bookingId, approve),
            approve
                ? MentorshipMessages.RESCHEDULE_ACCEPTED
                : MentorshipMessages.RESCHEDULE_DECLINED
        );
        if (data) fetchData();
    };

    const handleCancelBooking = (bookingId: string) => {
        toast.custom(
            (t) => (
                <div className="bg-white p-5 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col gap-4 min-w-[320px] animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-3 text-red-600">
                        <div className="p-2 bg-red-50 rounded-xl">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <h4 className="font-black text-sm uppercase tracking-tight text-gray-900">
                                {MentorshipMessages.CANCEL_SESSION_TITLE}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                {MentorshipMessages.CANCEL_ACTION_UNDONE}
                            </p>
                        </div>
                    </div>

                    <p className="text-sm font-medium text-gray-600 ml-1">
                        {MentorshipMessages.CANCEL_SESSION_CONFIRM_TEXT}
                    </p>

                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={() => toast.dismiss(t)}
                            className="px-4 py-2 text-[10px] font-black uppercase text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {MentorshipMessages.CANCEL_KEEP_BTN}
                        </button>
                        <button
                            onClick={async () => {
                                toast.dismiss(t);
                                const data = await requestWrapper(
                                    bookingApi.updateStatus({
                                        bookingId,
                                        status: BookingStatus.CANCELLED,
                                    }),
                                    MentorshipMessages.BOOKING_CANCELLED
                                );
                                if (data) fetchData();
                            }}
                            className="px-6 py-2 bg-black text-white text-[10px] font-black uppercase rounded-xl hover:bg-red-600 transition-all shadow-lg hover:shadow-red-200"
                        >
                            {MentorshipMessages.CANCEL_CONFIRM_BTN}
                        </button>
                    </div>
                </div>
            ),
            { duration: Infinity }
        );
    };

    const handleReviewSubmit = async (rating: number, comment: string) => {
        if (!selectedBookingForReview) return;
        try {
            const mentorData = mentorship?.mentorId as Mentor;
            await reviewApi.submitReview({
                bookingId: selectedBookingForReview.id,
                mentorId:
                    (mentorData as any)._id ||
                    (mentorData as any).id ||
                    String(mentorData),
                userId: currentUser?.id || '',
                rating,
                comment,
            });
            setIsReviewModalOpen(false);
            fetchData();
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || MentorshipMessages.REVIEW_ERROR_FALLBACK
            );
        }
    };

    const handleCancelMentorship = async () => {
        if (!id) return;
        setIsProcessing(true);
        const data = await requestWrapper(
            mentorshipApi.cancelMentorship(id),
            MentorshipMessages.MENTORSHIP_CANCELLED
        );
        if (data) fetchData();
        setIsProcessing(false);
        setIsCancelModalOpen(false);
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
                    {MentorshipMessages.NOT_FOUND_TITLE}
                </h2>
                <button
                    onClick={() => navigate('/home')}
                    className="mt-4 text-[#7F00FF] font-bold"
                >
                    {MentorshipMessages.BTN_RETURN_HOME}
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
                                {MentorshipMessages.REJECTED_TITLE}
                            </h2>
                            <p className="text-gray-500 mb-6 font-medium">
                                {MentorshipMessages.REJECTED_BODY}
                            </p>

                            <div className="bg-gray-50 rounded-2xl p-6 text-left mb-6">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                                    {MentorshipMessages.REJECTED_REASON_LABEL}
                                </h3>
                                <p className="text-gray-800 font-medium">
                                    {mentorship.rejectionReason ||
                                        MentorshipMessages.REJECTED_NO_REASON}
                                </p>

                                {mentorship.mentorSuggestedStartDate && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                                            {MentorshipMessages.REJECTED_REAPPLY_LABEL}
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
                                {MentorshipMessages.BTN_BACK_TO_HOME}
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
        <div className="h-screen flex bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Navbar />
                <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                    <div className="max-w-[90rem] mx-auto">
                        <div className="mb-6">
                            <Breadcrumbs />
                        </div>

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
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                                {MentorshipMessages.PAGE_TITLE}
                                {mentorship.status ===
                                    MentorshipStatus.COMPLETED && (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-black rounded-lg uppercase tracking-wider">
                                        {MentorshipMessages.STATUS_COMPLETED}
                                    </span>
                                )}
                                {mentorship.status ===
                                    MentorshipStatus.CANCELLED && (
                                    <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-black rounded-lg uppercase tracking-wider">
                                        {MentorshipMessages.STATUS_CANCELLED}
                                    </span>
                                )}
                            </h1>
                        </div>

                        {/* LIVE SESSION CARD */}
                        {nextSession &&
                            mentorship.status !== MentorshipStatus.COMPLETED &&
                            mentorship.status !==
                                MentorshipStatus.CANCELLED && (
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
                                                        ? MentorshipMessages.SESSION_HAPPENING_NOW
                                                        : MentorshipMessages.SESSION_UPCOMING}
                                                </span>
                                            </div>
                                            <h2 className="text-2xl font-black mb-1">
                                                {nextSession.topic ||
                                                    MentorshipMessages.SESSION_DEFAULT_TOPIC}
                                            </h2>
                                            <p className="text-white/60 text-sm">
                                                {nextSession.bookingDate
                                                    ? format(
                                                          new Date(
                                                              nextSession.bookingDate
                                                          ),
                                                          'MMMM d, yyyy'
                                                      )
                                                    : MentorshipMessages.SESSION_DATE_TBD}{' '}
                                                • {nextSession.slot}
                                            </p>
                                        </div>

                                        <button
                                            onClick={handleJoinSession}
                                            disabled={
                                                isMentor
                                                    ? !isSessionStartable()
                                                    : !isSessionActive
                                            }
                                            className={`px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-lg
                                            ${
                                                isMentor
                                                    ? isSessionStartable()
                                                        ? 'bg-white text-gray-900 hover:bg-gray-100'
                                                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                                                    : isSessionActive
                                                      ? 'bg-[#7F00FF] text-white hover:bg-[#6c00db] shadow-[#7F00FF]/30'
                                                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                                            }
                                        `}
                                        >
                                            <Video size={20} />
                                            {isMentor
                                                ? isSessionStartable()
                                                    ? MentorshipMessages.BTN_START_SESSION
                                                    : isBookingPast(
                                                            nextSession.bookingDate,
                                                            nextSession.slot
                                                        )
                                                      ? MentorshipMessages.BTN_SESSION_EXPIRED
                                                      : MentorshipMessages.BTN_START_SESSION
                                                : isSessionActive
                                                  ? MentorshipMessages.BTN_JOIN_SESSION
                                                  : MentorshipMessages.BTN_WAITING_HOST}
                                        </button>
                                    </div>
                                </div>
                            )}

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Left Column: Progress & Profile */}
                            <div className="lg:col-span-4 space-y-8">
                                {/* Mentor Profile Mini & Actions */}
                                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
                                        {MentorshipMessages.YOUR_MENTOR_LABEL}
                                    </h3>
                                    <div className="flex items-center gap-4 mb-6">
                                        <img
                                            src={
                                                (mentorship.mentorId as Mentor)
                                                    ?.profilePic ||
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent((mentorship.mentorId as Mentor)?.name || MentorshipMessages.MENTOR_DEFAULT_NAME)}`
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
                                                    ?.expertise || MentorshipMessages.MENTOR_DEFAULT_EXPERTISE}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-6 border-t border-gray-50">
                                        <button
                                            onClick={() => navigate('/chat')}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-[#7F00FF] hover:text-white transition-all group"
                                        >
                                            <MessageSquare
                                                size={16}
                                                className="group-hover:scale-110 transition-transform"
                                            />{' '}
                                            {MentorshipMessages.BTN_CHAT}
                                        </button>
                                        <button
                                            onClick={() =>
                                                setIsPolicyModalOpen(true)
                                            }
                                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-900 hover:text-white transition-all group"
                                        >
                                            <Info
                                                size={16}
                                                className="group-hover:scale-110 transition-transform"
                                            />{' '}
                                            {MentorshipMessages.BTN_POLICY}
                                        </button>
                                        {mentorship.status ===
                                            MentorshipStatus.ACTIVE &&
                                            !isMentor && (
                                                <button
                                                    onClick={() =>
                                                        setIsCancelModalOpen(
                                                            true
                                                        )
                                                    }
                                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all group"
                                                >
                                                    <XCircle
                                                        size={16}
                                                        className="group-hover:scale-110 transition-transform"
                                                    />{' '}
                                                    {MentorshipMessages.BTN_CANCEL}
                                                </button>
                                            )}
                                    </div>
                                </div>
                                {/* Session Usage Chart / Card */}
                                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 mb-1">
                                                {MentorshipMessages.SESSION_USAGE_TITLE}
                                            </h2>
                                            <p className="text-gray-500 text-sm">
                                                {MentorshipMessages.SESSION_USAGE_SUBTITLE}
                                            </p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="text-center">
                                                <p className="text-2xl font-black text-[#7F00FF]">
                                                    {mentorship.totalSessions}
                                                </p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    {MentorshipMessages.LABEL_TOTAL}
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-black text-green-500">
                                                    {mentorship.usedSessions}
                                                </p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    {MentorshipMessages.LABEL_USED}
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-black text-orange-500">
                                                    {remainingSessions}
                                                </p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    {MentorshipMessages.LABEL_LEFT}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase">
                                            <span>{MentorshipMessages.LABEL_PROGRESS}</span>
                                            <span>
                                                {Math.round(
                                                    (mentorship.usedSessions /
                                                        mentorship.totalSessions) *
                                                        100
                                                )}
                                                {MentorshipMessages.LABEL_PERCENT_COMPLETE}
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
                            </div>

                            {/* Right Column: Book & Info */}
                            <div className="lg:col-span-8 space-y-8">
                                {/* Action Cards based on Status */}
                                {mentorship.status ===
                                    MentorshipStatus.MENTOR_ACCEPTED && (
                                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            {MentorshipMessages.ACCEPTED_TITLE}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            {MentorshipMessages.ACCEPTED_BODY}
                                            {mentorship.mentorSuggestedStartDate && (
                                                <span className="block mt-2 font-medium text-[#7F00FF]">
                                                    {MentorshipMessages.ACCEPTED_SUGGESTED_DATE_PREFIX}{' '}
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
                                                {MentorshipMessages.BTN_CONFIRM_PAY}
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleConfirm(false)
                                                }
                                                disabled={isProcessing}
                                                className="flex-1 py-3 bg-red-50 text-red-600 font-black rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                                            >
                                                {MentorshipMessages.BTN_REJECT}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {mentorship.status ===
                                    MentorshipStatus.PAYMENT_PENDING && (
                                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            {MentorshipMessages.PAYMENT_REQUIRED_TITLE}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            {MentorshipMessages.PAYMENT_REQUIRED_BODY}
                                        </p>
                                        <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-xl">
                                            <span className="text-sm font-medium text-gray-600">
                                                {MentorshipMessages.PAYMENT_TOTAL_AMOUNT}
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
                                                ? MentorshipMessages.BTN_PROCESSING
                                                : MentorshipMessages.BTN_PAY_NOW}
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
                                                    {MentorshipMessages.SCHEDULE_SESSION_TITLE}
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
                                                        {MentorshipMessages.SESSIONS_REMAINING_HINT(remainingSessions)}
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

                                {/* Completion Section */}

                                {/* Completion Section */}
                                {mentorship.status ===
                                    MentorshipStatus.ACTIVE &&
                                    mentorship.usedSessions >= 7 && (
                                        <div className="bg-green-50 rounded-3xl p-6 border border-green-100">
                                            <h3 className="text-green-800 font-bold mb-2">
                                                {MentorshipMessages.COMPLETION_TITLE}
                                            </h3>
                                            <p className="text-sm text-green-700 mb-4 leading-relaxed">
                                                {MentorshipMessages.COMPLETION_BODY}
                                            </p>
                                            <button
                                                onClick={handleComplete}
                                                disabled={
                                                    mentorship.userConfirmedCompletion
                                                }
                                                className="w-full py-3 bg-green-600 text-white font-black rounded-xl hover:bg-green-700 active:scale-95 transition-all disabled:opacity-50"
                                            >
                                                {mentorship.userConfirmedCompletion
                                                    ? MentorshipMessages.BTN_AWAITING_MENTOR
                                                    : MentorshipMessages.BTN_CONFIRM_COMPLETION}
                                            </button>
                                        </div>
                                    )}
                                {/* Sessions List */}
                                <div className="mt-8 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {MentorshipMessages.RECENT_SESSIONS_TITLE}
                                        </h3>
                                    </div>
                                    <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto custom-scrollbar">
                                        {existingBookings.length === 0 ? (
                                            <div className="p-12 text-center">
                                                <Calendar
                                                    size={48}
                                                    className="mx-auto text-gray-200 mb-4"
                                                />
                                                <p className="text-gray-500 font-medium">
                                                    {MentorshipMessages.NO_SESSIONS_TITLE}
                                                </p>
                                                <p className="text-gray-400 text-xs mt-1">
                                                    {MentorshipMessages.NO_SESSIONS_HINT}
                                                </p>
                                            </div>
                                        ) : (
                                            existingBookings.map(
                                                (booking, idx) => {
                                                    const isPast =
                                                        isBookingPast(
                                                            booking.bookingDate,
                                                            booking.slot
                                                        );
                                                    const isInactive =
                                                        mentorship.status ===
                                                            MentorshipStatus.COMPLETED ||
                                                        mentorship.status ===
                                                            MentorshipStatus.CANCELLED;

                                                    return (
                                                        <div
                                                            key={booking.id}
                                                            className={`p-6 transition-colors flex flex-col gap-4 group ${isPast || isInactive ? 'opacity-60 grayscale-[0.6] bg-gray-100/50' : 'hover:bg-gray-50'}`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-12 h-12 bg-[#7F00FF]/5 rounded-2xl flex flex-col items-center justify-center text-[#7F00FF]">
                                                                        <span className="text-[10px] font-black uppercase">
                                                                            {booking.bookingDate
                                                                                ? format(
                                                                                      new Date(
                                                                                          booking.bookingDate
                                                                                      ),
                                                                                      'MMM'
                                                                                  )
                                                                                : '---'}
                                                                        </span>
                                                                        <span className="text-lg font-black leading-none">
                                                                            {booking.bookingDate
                                                                                ? format(
                                                                                      new Date(
                                                                                          booking.bookingDate
                                                                                      ),
                                                                                      'd'
                                                                                  )
                                                                                : '--'}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-gray-900">
                                                                            {booking.topic ||
                                                                                MentorshipMessages.SESSION_FALLBACK_TOPIC(idx + 1)}
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
                                                                    {(booking.status ===
                                                                        'confirmed' ||
                                                                        booking.status ===
                                                                            'pending' ||
                                                                        booking.status ===
                                                                            'rescheduled') &&
                                                                        !isPast && (
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleCancelBooking(
                                                                                        booking.id
                                                                                    )
                                                                                }
                                                                                className="p-3 bg-white border border-gray-100 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
                                                                                title="Cancel Booking"
                                                                            >
                                                                                <XCircle
                                                                                    size={
                                                                                        18
                                                                                    }
                                                                                />
                                                                            </button>
                                                                        )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {selectedBookingForReview && (
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    onSubmit={handleReviewSubmit}
                    mentorName={
                        (mentorship?.mentorId as Mentor)?.name || MentorshipMessages.MENTOR_DEFAULT_NAME
                    }
                    canSkip={true}
                />
            )}
            <RescheduleModal
                isOpen={isRescheduleModalOpen}
                onClose={() => setIsRescheduleModalOpen(false)}
                onConfirm={confirmReschedule}
                bookingDetails={rescheduleData}
            />

            <CancelMentorshipModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleCancelMentorship}
                isLoading={isProcessing}
            />

            {/* Policy Modal */}
            {isPolicyModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="bg-gradient-to-r from-[#7F00FF] to-[#E100FF] p-8 text-white relative">
                            <button
                                onClick={() => setIsPolicyModalOpen(false)}
                                className="absolute top-6 right-6 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                            >
                                <XCircle size={20} />
                            </button>
                            <h3 className="text-2xl font-black mb-2">
                                {MentorshipMessages.POLICY_MODAL_TITLE}
                            </h3>
                            <p className="text-white/80 font-medium italic">
                                {MentorshipMessages.POLICY_MODAL_SUBTITLE}
                            </p>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                                    <div className="shrink-0 w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#7F00FF]">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">
                                            {MentorshipMessages.POLICY_PERSONAL_GUIDANCE_TITLE}
                                        </p>
                                        <p className="text-xs text-gray-500 font-medium">
                                            {MentorshipMessages.POLICY_PERSONAL_GUIDANCE_BODY}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                                    <div className="shrink-0 w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#7F00FF]">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">
                                            {MentorshipMessages.POLICY_SCHEDULE_TITLE}
                                        </p>
                                        <p className="text-xs text-gray-500 font-medium">
                                            {MentorshipMessages.POLICY_SCHEDULE_BODY(mentorship.totalSessions)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                                    <div className="shrink-0 w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#7F00FF]">
                                        <Video size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">
                                            {MentorshipMessages.POLICY_COMMUNICATION_TITLE}
                                        </p>
                                        <p className="text-xs text-gray-500 font-medium">
                                            {MentorshipMessages.POLICY_COMMUNICATION_BODY}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                                    <div className="shrink-0 w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#7F00FF]">
                                        <XCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">
                                            {MentorshipMessages.POLICY_RESCHEDULE_TITLE}
                                        </p>
                                        <p className="text-xs text-gray-500 font-medium">
                                            {MentorshipMessages.POLICY_RESCHEDULE_BODY}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsPolicyModalOpen(false)}
                                className="w-full py-4 bg-black text-white font-black rounded-2xl shadow-xl hover:bg-gray-800 transition-all"
                            >
                                {MentorshipMessages.BTN_UNDERSTOOD}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorshipManagementPage;

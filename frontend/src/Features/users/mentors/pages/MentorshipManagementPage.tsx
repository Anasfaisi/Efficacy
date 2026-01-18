import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mentorshipApi } from '@/Services/mentorship.api';
import type { Mentorship } from '@/types/mentorship';
import { MentorshipStatus, SessionStatus } from '@/types/mentorship';
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
} from 'lucide-react';
import { toast } from 'sonner';

const MentorshipManagementPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [mentorship, setMentorship] = useState<Mentorship | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookingDate, setBookingDate] = useState('');
    const [isBooking, setIsBooking] = useState(false);

    const fetchData = async () => {
        if (!id) return;
        try {
            // Reusing getActiveMentorship for now or ideally a getById
            const data = await mentorshipApi.getActiveMentorship();
            if (data._id !== id) {
                // Fetch by ID if not active
                // For now assuming active
            }
            setMentorship(data);
        } catch (error) {
            console.error('Failed to fetch mentorship:', error);
            toast.error('Failed to load mentorship details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleBookSession = async () => {
        if (!id || !bookingDate) return;
        setIsBooking(true);
        try {
            await mentorshipApi.bookSession(id, new Date(bookingDate));
            toast.success('Session booked successfully!');
            setBookingDate('');
            fetchData();
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 'Failed to book session',
            );
        } finally {
            setIsBooking(false);
        }
    };

    const handleComplete = async () => {
        if (!id) return;
        try {
            await mentorshipApi.completeMentorship(id, 'user');
            toast.success(
                'You have confirmed the completion of this mentorship!',
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
                                                        100,
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
                                            Booked Sessions
                                        </h3>
                                        <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-black rounded-lg">
                                            Coming Up
                                        </span>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {mentorship.sessions.length === 0 ? (
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
                                            mentorship.sessions.map(
                                                (session, idx) => (
                                                    <div
                                                        key={session._id}
                                                        className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-[#7F00FF]/5 rounded-2xl flex flex-col items-center justify-center text-[#7F00FF]">
                                                                <span className="text-[10px] font-black uppercase">
                                                                    {new Date(
                                                                        session.date,
                                                                    ).toLocaleString(
                                                                        'default',
                                                                        {
                                                                            month: 'short',
                                                                        },
                                                                    )}
                                                                </span>
                                                                <span className="text-lg font-black leading-none">
                                                                    {new Date(
                                                                        session.date,
                                                                    ).getDate()}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-900">
                                                                    Mentorship
                                                                    Session #
                                                                    {idx + 1}
                                                                </p>
                                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                    <Clock
                                                                        size={
                                                                            12
                                                                        }
                                                                    />
                                                                    <span>
                                                                        {new Date(
                                                                            session.date,
                                                                        ).toLocaleTimeString(
                                                                            [],
                                                                            {
                                                                                hour: '2-digit',
                                                                                minute: '2-digit',
                                                                            },
                                                                        )}
                                                                    </span>
                                                                    <span className="mx-1">
                                                                        •
                                                                    </span>
                                                                    <span
                                                                        className={`capitalize font-bold ${session.status === SessionStatus.COMPLETED ? 'text-green-500' : 'text-orange-500'}`}
                                                                    >
                                                                        {
                                                                            session.status
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {session.status ===
                                                            SessionStatus.BOOKED && (
                                                            <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-[#7F00FF] hover:border-[#7F00FF]/30 transition-all shadow-sm">
                                                                <ExternalLink
                                                                    size={18}
                                                                />
                                                            </button>
                                                        )}
                                                    </div>
                                                ),
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Book & Info */}
                            <div className="space-y-8">
                                {/* Book New Session */}
                                {remainingSessions > 0 &&
                                    mentorship.status ===
                                        MentorshipStatus.ACTIVE && (
                                        <div className="bg-gradient-to-br from-[#7F00FF] to-[#E100FF] rounded-3xl p-6 text-white shadow-xl shadow-[#7F00FF]/20 relative overflow-hidden">
                                            <div className="relative z-10">
                                                <h3 className="text-lg font-black mb-4">
                                                    Book a Session
                                                </h3>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-[10px] font-black text-white/60 uppercase tracking-widest mb-2">
                                                            Select Date & Time
                                                        </label>
                                                        <input
                                                            type="datetime-local"
                                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30 [color-scheme:dark]"
                                                            value={bookingDate}
                                                            onChange={(e) =>
                                                                setBookingDate(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            min={new Date()
                                                                .toISOString()
                                                                .slice(0, 16)}
                                                        />
                                                    </div>
                                                    <button
                                                        disabled={
                                                            isBooking ||
                                                            !bookingDate
                                                        }
                                                        onClick={
                                                            handleBookSession
                                                        }
                                                        className="w-full py-4 bg-white text-[#7F00FF] font-black rounded-2xl hover:bg-gray-50 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-black/10"
                                                    >
                                                        {isBooking
                                                            ? 'Processing...'
                                                            : 'Schedule Now'}
                                                    </button>
                                                    <p className="text-[10px] text-center text-white/60 font-medium">
                                                        You have{' '}
                                                        {remainingSessions}{' '}
                                                        sessions left this month
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                                        </div>
                                    )}

                                {/* Mentor Profile Mini */}
                                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
                                        Your Mentor
                                    </h3>
                                    <div className="flex items-center gap-4 mb-6">
                                        <img
                                            src={
                                                mentorship.mentorId
                                                    ?.profilePic ||
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorship.mentorId?.name || 'Mentor')}`
                                            }
                                            className="w-16 h-16 rounded-2xl object-cover"
                                            alt=""
                                        />
                                        <div>
                                            <h4 className="font-bold text-gray-900">
                                                {mentorship.mentorId?.name}
                                            </h4>
                                            <p className="text-xs text-[#7F00FF] font-semibold">
                                                {mentorship.mentorId
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

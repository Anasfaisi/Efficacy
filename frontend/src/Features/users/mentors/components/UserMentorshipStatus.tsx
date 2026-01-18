import React, { useEffect, useState } from 'react';
import { mentorshipApi } from '@/Services/mentorship.api';
import type { Mentorship } from '@/types/mentorship';
import { MentorshipStatus } from '@/types/mentorship';
import {
    Calendar,
    MessageSquare,
    Clock,
    CreditCard,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Play,
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const UserMentorshipStatus: React.FC = () => {
    const [mentorship, setMentorship] = useState<Mentorship | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStatus = async () => {
        try {
            const data = await mentorshipApi.getActiveMentorship();
            setMentorship(data);
        } catch (error) {
            // Probably no active mentorship
            console.error('Failed to fetch mentorship status:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handleConfirmSuggestion = async (confirm: boolean) => {
        if (!mentorship?._id) return;
        try {
            await mentorshipApi.confirmSuggestion(mentorship._id, confirm);
            toast.success(
                confirm ? 'Suggestion confirmed!' : 'Suggestion rejected.',
            );
            fetchStatus();
        } catch (error: any) {
            toast.error(error.message || 'Failed to confirm suggestion');
        }
    };

    const handlePayment = async () => {
        if (!mentorship?._id) return;
        try {
            const paymentId = 'pi_' + Math.random().toString(36).substr(2, 9);
            await mentorshipApi.verifyPayment(mentorship._id, paymentId);
            toast.success(
                'Payment verified successfully! Mentorship is now ACTIVE.',
            );
            fetchStatus();
        } catch (error: any) {
            toast.error(error.message || 'Payment verification failed');
        }
    };

    if (loading) return null;
    if (!mentorship) return null;

    return (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50 mb-8 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users size={120} className="text-[#7F00FF]" />
            </div>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img
                                src={
                                    mentorship.mentorId?.profilePic ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorship.mentorId?.name || 'Mentor')}`
                                }
                                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#7F00FF]/20"
                                alt=""
                            />
                            {mentorship.status === MentorshipStatus.ACTIVE && (
                                <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white" />
                            )}
                        </div>
                        <div>
                            <p className="text-xs font-black text-[#7F00FF] uppercase tracking-widest mb-1">
                                Your Mentorship
                            </p>
                            <h3 className="text-xl font-black text-gray-900">
                                {mentorship.mentorId?.name}
                            </h3>
                            <p className="text-sm text-gray-500 font-medium">
                                {mentorship.mentorId?.currentRole ||
                                    'Expert Mentor'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {mentorship.status === MentorshipStatus.PENDING && (
                            <span className="px-4 py-2 bg-yellow-50 text-yellow-700 text-xs font-black rounded-xl border border-yellow-100 flex items-center gap-2">
                                <Clock size={14} /> Pending Approval
                            </span>
                        )}
                        {mentorship.status ===
                            MentorshipStatus.MENTOR_ACCEPTED && (
                            <div className="flex flex-col gap-2">
                                <span className="px-4 py-2 bg-green-50 text-green-700 text-xs font-black rounded-xl border border-green-100 flex items-center gap-2">
                                    <CheckCircle2 size={14} /> Mentor Accepted!
                                </span>
                                {mentorship.mentorSuggestedStartDate && (
                                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                                        <p className="text-[10px] font-black text-indigo-400 uppercase mb-2">
                                            Mentor suggested start date:
                                        </p>
                                        <p className="text-sm font-bold text-indigo-900 mb-3">
                                            {new Date(
                                                mentorship.mentorSuggestedStartDate,
                                            ).toLocaleDateString()}
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    handleConfirmSuggestion(
                                                        true,
                                                    )
                                                }
                                                className="px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-lg hover:bg-indigo-700 transition-all"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleConfirmSuggestion(
                                                        false,
                                                    )
                                                }
                                                className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-600 text-[10px] font-black rounded-lg hover:bg-indigo-50 transition-all"
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {mentorship.status ===
                            MentorshipStatus.PAYMENT_PENDING && (
                            <button
                                onClick={handlePayment}
                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-black rounded-xl shadow-lg shadow-green-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                            >
                                <CreditCard size={18} /> Proceed to Pay ₹
                                {mentorship.amount}
                            </button>
                        )}
                        {mentorship.status === MentorshipStatus.ACTIVE && (
                            <span className="px-4 py-2 bg-[#7F00FF] text-white text-xs font-black rounded-xl shadow-lg shadow-[#7F00FF]/20 flex items-center gap-2">
                                <Play size={14} fill="white" /> Active
                                Subscription
                            </span>
                        )}
                    </div>
                </div>

                {mentorship.status === MentorshipStatus.ACTIVE && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-50">
                        <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                                Session Progress
                            </p>
                            <div className="flex items-end justify-between mb-2">
                                <span className="text-2xl font-black text-gray-900">
                                    {mentorship.usedSessions} /{' '}
                                    {mentorship.totalSessions}
                                </span>
                                <span className="text-xs font-bold text-[#7F00FF]">
                                    {Math.round(
                                        (mentorship.usedSessions /
                                            mentorship.totalSessions) *
                                            100,
                                    )}
                                    % Used
                                </span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#7F00FF] to-[#E100FF] rounded-full transition-all duration-1000"
                                    style={{
                                        width: `${(mentorship.usedSessions / mentorship.totalSessions) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                                Subscription Period
                            </p>
                            <div className="flex items-center gap-3">
                                <Calendar
                                    className="text-[#7F00FF]"
                                    size={20}
                                />
                                <div>
                                    <p className="text-sm font-bold text-gray-900">
                                        {new Date(
                                            mentorship.startDate!,
                                        ).toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-gray-500 font-medium">
                                        to{' '}
                                        {new Date(
                                            mentorship.endDate!,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Link
                                to={`/mentorship/${mentorship._id}`}
                                className="flex-1 flex items-center justify-between px-6 bg-white border border-gray-100 rounded-2xl hover:border-[#7F00FF]/30 hover:shadow-lg transition-all group/link shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <Calendar
                                        className="text-[#7F00FF]"
                                        size={20}
                                    />
                                    <span className="text-sm font-bold text-gray-900">
                                        Manage Sessions
                                    </span>
                                </div>
                                <ChevronRight
                                    size={18}
                                    className="text-gray-300 group-hover/link:text-[#7F00FF] transition-colors"
                                />
                            </Link>
                            <Link
                                to="/chat"
                                className="flex-1 flex items-center justify-between px-6 bg-[#7F00FF]/5 border border-[#7F00FF]/10 rounded-2xl hover:bg-[#7F00FF]/10 transition-all group/chat"
                            >
                                <div className="flex items-center gap-3">
                                    <MessageSquare
                                        className="text-[#7F00FF]"
                                        size={20}
                                    />
                                    <span className="text-sm font-bold text-[#7F00FF]">
                                        Open Q&A Chat
                                    </span>
                                </div>
                                <span className="px-2 py-0.5 bg-[#7F00FF] text-white text-[10px] font-black rounded-lg opacity-80 group-hover/chat:opacity-100 transition-opacity">
                                    Unlimited
                                </span>
                            </Link>
                        </div>
                    </div>
                )}

                {mentorship.status === MentorshipStatus.PENDING && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                        <AlertCircle className="text-yellow-500" size={20} />
                        <p className="text-sm text-gray-600 font-medium">
                            Mentor is reviewing your request. You'll be notified
                            once they respond.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserMentorshipStatus;

// Helper component for Users icon
const Users = ({ className, size }: { className?: string; size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size || 24}
        height={size || 24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

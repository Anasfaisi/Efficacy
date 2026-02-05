import type { Mentor } from '@/types/auth';
import React, { useState } from 'react';
import {
    X,
    Star,
    MapPin,
    Briefcase,
    GraduationCap,
    Calendar,
    MessageSquare,
    Clock,
    ShieldCheck,
    IndianRupee,
    Info,
} from 'lucide-react';
import { mentorshipApi } from '@/Services/mentorship.api';
import { toast } from 'sonner';

interface MentorDetailsModalProps {
    mentor: Mentor;
    onClose: () => void;
}

const MentorDetailsModal: React.FC<MentorDetailsModalProps> = ({
    mentor,
    onClose,
}) => {
    const [isBooking, setIsBooking] = useState(false);
    const [proposedStartDate, setProposedStartDate] = useState('');

    const handleBooking = async () => {
        if (proposedStartDate) {
            const selectedDate = new Date(proposedStartDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                toast.error('Proposed start date cannot be in the past.');
                return;
            }
        }
        setIsBooking(true);
        try {
            await mentorshipApi.createRequest({
                mentorId: mentor.id || mentor._id!,
                sessions: 10,
                proposedStartDate: proposedStartDate
                    ? new Date(proposedStartDate)
                    : undefined,
            });
            toast.success(
                'Mentorship request sent successfully! Wait for mentor approval.'
            );
            onClose();
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to send mentorship request'
            );
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 mt-20 mb-10">
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all z-10"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                    {/* Left Side - Profile Info */}
                    <div className="w-full md:w-2/5 p-8 border-r border-gray-100 bg-gray-50/50 rounded-l-3xl overflow-y-auto">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-6">
                                <img
                                    src={
                                        mentor.profilePic ||
                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=7F00FF&color=fff`
                                    }
                                    alt={mentor.name}
                                    className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-xl"
                                />
                                <div
                                    className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-white w-8 h-8 rounded-full shadow-lg"
                                    title="Available"
                                />
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                {mentor.name}
                            </h2>
                            <p className="text-[#7F00FF] font-semibold mb-6">
                                {mentor.currentRole ||
                                    mentor.domain ||
                                    'Expert Mentor'}
                            </p>

                            <div className="grid grid-cols-2 gap-4 w-full mb-8">
                                <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm text-center">
                                    <div className="text-yellow-500 flex justify-center mb-1">
                                        <Star
                                            size={20}
                                            className="fill-current"
                                        />
                                    </div>
                                    <span className="text-lg font-bold text-gray-900">
                                        {mentor.rating || '5.0'}
                                    </span>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                                        Rating
                                    </p>
                                </div>
                                <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm text-center">
                                    <div className="text-[#7F00FF] flex justify-center mb-1">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <span className="text-lg font-bold text-gray-900">
                                        {mentor.experienceYears || '5'}+
                                    </span>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                                        Years Exp
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 w-full text-left">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                                        <MapPin
                                            size={18}
                                            className="text-[#7F00FF]"
                                        />
                                    </div>
                                    <span className="text-sm">
                                        {mentor.city || 'Tech Hub'},{' '}
                                        {mentor.country || 'India'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                                        <Briefcase
                                            size={18}
                                            className="text-[#7F00FF]"
                                        />
                                    </div>
                                    <span className="text-sm">
                                        {mentor.experienceSummary ||
                                            mentor.expertise ||
                                            'Industry Expert'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                                        <GraduationCap
                                            size={18}
                                            className="text-[#7F00FF]"
                                        />
                                    </div>
                                    <span className="text-sm">
                                        {mentor.university ||
                                            mentor.qualification ||
                                            'Global Tech Institute'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Details & Booking */}
                    <div className="flex-1 p-8 overflow-y-auto">
                        <section className="mb-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Info size={18} className="text-[#7F00FF]" />
                                About Mentor
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {mentor.bio ||
                                    `Passionate ${mentor.expertise || 'expert'} with over ${mentor.experienceYears || '5'} years of experience in the industry. I've helped numerous students transition into high-paying roles and master complex technical concepts.`}
                            </p>
                        </section>

                        <section className="mb-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <ShieldCheck
                                    size={18}
                                    className="text-[#7F00FF]"
                                />
                                Mentorship Policy
                            </h3>
                            <div className="bg-[#7F00FF]/5 rounded-2xl p-5 border border-[#7F00FF]/10">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar
                                            size={18}
                                            className="text-[#7F00FF] mt-1"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">
                                                1-Month Duration
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Subscription-based mentorship
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock
                                            size={18}
                                            className="text-[#7F00FF] mt-1"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">
                                                7-10 Sessions
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Flexible scheduling
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 opacity-50">
                                        <MessageSquare
                                            size={18}
                                            className="text-gray-400 mt-1"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-gray-400">
                                                Unlimited Q&A Chat
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Available after activation
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Info
                                            size={18}
                                            className="text-[#7F00FF] mt-1"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">
                                                Escrow Payment
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Payout after completion
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="mt-auto pt-8 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Monthly Mentorship Fee
                                    </p>
                                    <div className="flex items-baseline gap-1">
                                        <IndianRupee
                                            size={20}
                                            className="text-gray-900"
                                        />
                                        <span className="text-3xl font-black text-gray-900">
                                            {mentor.monthlyCharge || '0'}
                                        </span>
                                        <span className="text-gray-400 font-medium">
                                            /month
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                                        Preferred Start Date
                                    </label>
                                    <input
                                        type="date"
                                        className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7F00FF]/20 focus:outline-none"
                                        value={proposedStartDate}
                                        onChange={(e) =>
                                            setProposedStartDate(e.target.value)
                                        }
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split('T')[0]
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    disabled={true}
                                    title="Chat available for active subscriptions"
                                    className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl border-2 border-gray-200 text-gray-400 font-bold transition-all cursor-not-allowed group relative"
                                >
                                    <MessageSquare size={20} />
                                    Chat
                                </button>
                                <button
                                    disabled={isBooking}
                                    onClick={handleBooking}
                                    className="flex-[2] py-4 px-6 bg-gradient-to-r from-[#7F00FF] to-[#E100FF] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-[#7F00FF]/40 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isBooking
                                        ? 'Processing...'
                                        : 'Book 1-Month Mentorship'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorDetailsModal;

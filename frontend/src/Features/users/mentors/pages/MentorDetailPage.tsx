import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mentorApi } from '@/Services/mentor.api';
import type { Mentor } from '@/types/auth';
import Sidebar from '../../home/layouts/Sidebar';
import Navbar from '../../home/layouts/Navbar';
import {
    HeartHandshake,
    TrendingUp,
    Star,
    Briefcase,
    GraduationCap,
    Calendar,
    MapPin,
    Globe,
    Linkedin,
    Github,
    Quote,
    Award,
    CheckCircle2,
    Clock,
    ChevronLeft,
} from 'lucide-react';
import { mentorshipApi } from '@/Services/mentorship.api';
import { reviewApi, type Review } from '@/Services/review.api';
import { toast } from 'sonner';

const MentorDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [mentor, setMentor] = useState<Mentor | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const [proposedStartDate, setProposedStartDate] = useState('');
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const [mentorData, reviewsData] = await Promise.all([
                    mentorApi.getMentorById(id),
                    reviewApi.getMentorReviews(id),
                ]);
                console.log(
                    mentorData,
                    'mentordata  ... ',
                    reviewsData,
                    'reviewsData ... '
                );
                setMentor(mentorData);
                setReviews(reviewsData);
            } catch (error) {
                console.error('Failed to fetch mentor details:', error);
                toast.error('Could not load mentor details');
                navigate('/mentors');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="h-screen flex bg-gray-50 overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Navbar />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7F00FF]"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!mentor) return null;

    const skills = mentor.skills?.split(',').map((s) => s.trim()) || [];
    const guidanceAreas = mentor.guidanceAreas || [];

    const handleMentorshipRequest = async () => {
        if (!proposedStartDate) {
            toast.error('Please select a proposed start date');
            return;
        }
        const selectedDate = new Date(proposedStartDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            toast.error('Proposed start date cannot be in the past.');
            return;
        }

        setIsBooking(true);
        try {
            await mentorshipApi.createRequest({
                mentorId: mentor.id || mentor._id!,
                sessions: 10,
                proposedStartDate: new Date(proposedStartDate),
            });
            toast.success(
                'Mentorship request sent successfully! Wait for mentor approval.'
            );
        } catch (error) {
            const errorMessage =
                (error as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ||
                (error as Error).message ||
                'Failed to send mentorship request';
            toast.error(errorMessage);
        } finally {
            setIsBooking(false);
        }
    };

    const mentorshipPoints = [
        {
            title: 'Personal Guidance',
            content:
                'Support for career, job applications, and emotional well-being.',
            icon: <HeartHandshake className="w-5 h-5" />,
        },
        {
            title: 'Flexible Schedule',
            content:
                '10 regular sessions per month conducted on alternative days.',
            icon: <Clock className="w-5 h-5" />,
        },
        {
            title: 'Call Preference',
            content:
                'Your choice of high-quality Video or Audio call sessions.',
            icon: <Globe className="w-5 h-5" />,
        },
        {
            title: 'Easy Rescheduling',
            content:
                'Request changes up to 6 hours before your scheduled session.',
            icon: <CheckCircle2 className="w-5 h-5" />,
        },
    ];

    return (
        <div className="h-screen flex bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto custom-scrollbar pb-20">
                    {/* Hero / Cover Section */}
                    <div className="relative h-64 md:h-80 w-full overflow-hidden">
                        {mentor.coverPic ? (
                            <img
                                src={mentor.coverPic}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-r from-[#7F00FF] to-[#E100FF] opacity-90 relative">
                                <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="opacity-10 animate-pulse">
                                        <Award
                                            size={200}
                                            className="text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => navigate(-1)}
                            className="absolute top-6 left-6 p-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white/40 transition-all z-10"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-20">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            {/* Left Column - Sticky Profile Summary */}
                            <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8">
                                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center">
                                    <div className="relative mb-6">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-[#7F00FF] to-[#E100FF] rounded-[2rem] blur opacity-25" />
                                        <img
                                            src={
                                                mentor.profilePic ||
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=7F00FF&color=fff&size=200`
                                            }
                                            alt={mentor.name}
                                            className="relative w-40 h-40 rounded-[2rem] object-cover border-4 border-white shadow-lg"
                                        />
                                        {(mentor.isVerified ||
                                            reviews.length === 0) && (
                                            <div
                                                className={`absolute -bottom-2 -right-2 ${reviews.length === 0 ? 'bg-amber-500' : 'bg-green-500'} text-white px-3 py-1 rounded-full border-4 border-white shadow-lg text-[10px] font-black uppercase tracking-wider`}
                                            >
                                                {reviews.length === 0
                                                    ? 'New Talent'
                                                    : 'Verified'}
                                            </div>
                                        )}
                                    </div>

                                    <h1 className="text-2xl font-black text-gray-900 mb-1">
                                        {mentor.name}
                                    </h1>
                                    <p className="text-[#7F00FF] font-bold text-sm mb-4 uppercase tracking-wider">
                                        {mentor.currentRole ||
                                            mentor.domain ||
                                            'Mentor'}
                                    </p>

                                    <div className="flex items-center gap-6 mb-8 w-full justify-center">
                                        <div className="text-center">
                                            <p className="text-xl font-black text-gray-900 flex items-center gap-1 justify-center">
                                                <Star
                                                    size={18}
                                                    className="fill-yellow-400 text-yellow-400"
                                                />
                                                {mentor.rating?.toFixed(1) ||
                                                    '5.0'}
                                            </p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                Rating
                                            </p>
                                        </div>
                                        <div className="w-px h-10 bg-gray-100" />
                                        <div className="text-center">
                                            <p className="text-xl font-black text-gray-900">
                                                {reviews.length}
                                            </p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                Reviews
                                            </p>
                                        </div>
                                        <div className="w-px h-10 bg-gray-100" />
                                        <div className="text-center">
                                            <p className="text-xl font-black text-gray-900">
                                                {mentor.sessionsCompleted || 0}
                                            </p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                Sessions
                                            </p>
                                        </div>
                                    </div>

                                    <div className="w-full space-y-4 pt-6 border-t border-gray-50">
                                        <div className="flex flex-col gap-1 items-start">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                Proposed Start Date
                                            </span>
                                            <input
                                                type="date"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#7F00FF]/20 focus:outline-none font-bold"
                                                value={proposedStartDate}
                                                onChange={(e) =>
                                                    setProposedStartDate(
                                                        e.target.value
                                                    )
                                                }
                                                min={
                                                    new Date()
                                                        .toISOString()
                                                        .split('T')[0]
                                                }
                                            />
                                        </div>

                                        <button
                                            onClick={handleMentorshipRequest}
                                            disabled={isBooking}
                                            className="w-full py-4 bg-gradient-to-r from-[#7F00FF] to-[#E100FF] text-white font-black rounded-2xl shadow-xl shadow-[#7F00FF]/30 hover:shadow-[#7F00FF]/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isBooking
                                                ? 'Processing...'
                                                : 'Book Mentorship'}
                                            <Calendar size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Mentorship Plan (Moved to Left for continuous layout) */}
                                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                                    <h3 className="text-lg font-black text-gray-900 tracking-tight mb-6">
                                        Mentorship Plan
                                    </h3>
                                    <div className="space-y-6">
                                        {mentorshipPoints.map((point, idx) => (
                                            <div
                                                key={idx}
                                                className="flex gap-4"
                                            >
                                                <div className="mt-1 w-8 h-8 rounded-xl bg-purple-50 text-[#7F00FF] flex items-center justify-center shrink-0">
                                                    {point.icon}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 mb-0.5">
                                                        {point.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                                        {point.content}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Contact & Links */}
                                <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 space-y-6">
                                    <h3 className="text-lg font-black text-gray-900 tracking-tight">
                                        Connect
                                    </h3>
                                    <div className="space-y-4">
                                        {mentor.linkedin && (
                                            <a
                                                href={mentor.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 text-gray-600 hover:text-[#0077B5] transition-colors font-medium"
                                            >
                                                <div className="p-2 bg-blue-50 rounded-xl text-[#0077B5]">
                                                    <Linkedin size={18} />
                                                </div>
                                                LinkedIn Profile
                                            </a>
                                        )}
                                        {mentor.github && (
                                            <a
                                                href={mentor.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 text-gray-600 hover:text-black transition-colors font-medium"
                                            >
                                                <div className="p-2 bg-gray-100 rounded-xl text-black">
                                                    <Github size={18} />
                                                </div>
                                                GitHub Portfolio
                                            </a>
                                        )}
                                        <div className="flex items-center gap-3 text-gray-600 font-medium text-sm">
                                            <div className="p-2 bg-orange-50 rounded-xl text-orange-600">
                                                <MapPin size={18} />
                                            </div>
                                            {mentor.city}, {mentor.country}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Detailed Info */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* About / Bio */}
                                <section className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <Quote
                                            size={120}
                                            className="text-[#7F00FF]"
                                        />
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                        About Me
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed font-medium text-lg relative z-10 whitespace-pre-line">
                                        {mentor.bio ||
                                            'No biography provided yet.'}
                                    </p>
                                </section>

                                {/* Experience & Expertise */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <section className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                                        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                            <Briefcase
                                                size={22}
                                                className="text-[#7F00FF]"
                                            />
                                            Experience
                                        </h3>
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                                                    Current Role
                                                </p>
                                                <p className="font-bold text-gray-800">
                                                    {mentor.currentRole ||
                                                        'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                                                    Domain
                                                </p>
                                                <p className="font-bold text-gray-800">
                                                    {mentor.domain || 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                                                    Experience
                                                </p>
                                                <p className="font-bold text-gray-800">
                                                    {mentor.experienceYears ||
                                                        '0'}
                                                    + Years
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                                        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                            <GraduationCap
                                                size={22}
                                                className="text-[#7F00FF]"
                                            />
                                            Education
                                        </h3>
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                                                    Degree
                                                </p>
                                                <p className="font-bold text-gray-800">
                                                    {mentor.qualification ||
                                                        'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                                                    University
                                                </p>
                                                <p className="font-bold text-gray-800">
                                                    {mentor.university || 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                                                    Class Of
                                                </p>
                                                <p className="font-bold text-gray-800">
                                                    {mentor.graduationYear ||
                                                        'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                {/* Skills */}
                                <section className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
                                    <h3 className="text-xl font-black text-gray-900 mb-6">
                                        Expertise & Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {skills.map((skill, i) => (
                                            <span
                                                key={i}
                                                className="px-5 py-2.5 bg-gray-50 text-gray-700 font-bold rounded-2xl border border-gray-100 hover:border-[#7F00FF]/30 hover:bg-[#7F00FF]/5 transition-all text-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </section>

                                {/* Guidance Areas */}
                                {guidanceAreas.length > 0 && (
                                    <section className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
                                        <h3 className="text-xl font-black text-gray-900 mb-6">
                                            How I can guide you
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {guidanceAreas.map((area, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl group transition-all duration-300 border border-transparent hover:border-[#7F00FF]/10"
                                                >
                                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#7F00FF]">
                                                        <CheckCircle2
                                                            size={20}
                                                        />
                                                    </div>
                                                    <span className="font-bold text-gray-700">
                                                        {area}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Availability Summary */}
                                <section className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
                                    <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                        <Clock
                                            size={22}
                                            className="text-[#7F00FF]"
                                        />
                                        Scheduling
                                    </h3>
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="flex-1 space-y-3">
                                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                                                Active Days
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {Array.isArray(
                                                    mentor.availableDays
                                                ) ? (
                                                    mentor.availableDays.map(
                                                        (day) => (
                                                            <span
                                                                key={day}
                                                                className="px-3 py-1 bg-purple-50 text-[#7F00FF] font-bold rounded-lg text-xs uppercase letter-spacing-wide"
                                                            >
                                                                {day.substring(
                                                                    0,
                                                                    3
                                                                )}
                                                            </span>
                                                        )
                                                    )
                                                ) : (
                                                    <span className="text-gray-500 font-medium italic">
                                                        Refer to plan for
                                                        details
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                                                Time Slot Preference
                                            </p>
                                            <div className="text-gray-700 font-bold flex items-center gap-2">
                                                <Clock size={16} />
                                                {mentor.preferredTime &&
                                                mentor.preferredTime.length > 0
                                                    ? `${mentor.preferredTime[0]} - ${mentor.preferredTime[mentor.preferredTime.length - 1]}`
                                                    : 'Discuss in chat'}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Mentees Feedback / Reviews */}
                                <section className="space-y-6">
                                    <div className="flex items-center justify-between px-2">
                                        <h3 className="text-2xl font-black text-gray-900">
                                            Mentees Feedback
                                        </h3>
                                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                                            <Star
                                                className="fill-yellow-400 text-yellow-400"
                                                size={20}
                                            />
                                            <span className="font-black text-gray-900">
                                                {mentor.rating?.toFixed(1) ||
                                                    '5.0'}
                                            </span>
                                            <span className="text-gray-300 font-bold">
                                                ({reviews.length})
                                            </span>
                                        </div>
                                    </div>

                                    {reviews.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            {reviews.map((review) => (
                                                <div
                                                    key={review._id}
                                                    className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100"
                                                >
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="flex items-center gap-4">
                                                            <img
                                                                src={
                                                                    review
                                                                        .userId
                                                                        ?.profilePic ||
                                                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userId?.name || 'User')}&background=F3E8FF&color=7F00FF&bold=true`
                                                                }
                                                                alt={
                                                                    review
                                                                        .userId
                                                                        ?.name
                                                                }
                                                                className="w-14 h-14 rounded-2xl object-cover"
                                                            />
                                                            <div>
                                                                <h4 className="font-black text-gray-900">
                                                                    {review
                                                                        .userId
                                                                        ?.name ||
                                                                        'Anonymous User'}
                                                                </h4>
                                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                                                    Verified
                                                                    Student
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-0.5">
                                                            {[...Array(5)].map(
                                                                (_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        size={
                                                                            16
                                                                        }
                                                                        className={
                                                                            i <
                                                                            review.rating
                                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                                : 'text-gray-200'
                                                                        }
                                                                    />
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 font-medium leading-relaxed italic">
                                                        "{review.comment}"
                                                    </p>
                                                    <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
                                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                                            {new Date(
                                                                review.createdAt
                                                            ).toLocaleDateString(
                                                                'en-US',
                                                                {
                                                                    month: 'long',
                                                                    year: 'numeric',
                                                                }
                                                            )}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 text-green-500">
                                                            <CheckCircle2
                                                                size={12}
                                                            />
                                                            <span className="text-[9px] font-black uppercase tracking-widest">
                                                                Verified Session
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-[2rem] p-12 shadow-xl shadow-gray-200/50 border border-gray-100 text-center">
                                            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
                                                <TrendingUp
                                                    className="text-amber-500"
                                                    size={32}
                                                />
                                            </div>
                                            <h4 className="text-xl font-black text-gray-900 mb-2">
                                                New Talent Detected!
                                            </h4>
                                            <p className="text-gray-500 font-medium max-w-sm mx-auto">
                                                This mentor is new to our
                                                platform. Be the first to start
                                                a journey with them and shape
                                                the future!
                                            </p>
                                        </div>
                                    )}
                                </section>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MentorDetailPage;

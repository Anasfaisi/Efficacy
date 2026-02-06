import React, { useEffect, useState } from 'react';
import { mentorshipApi } from '@/Services/mentorship.api';
import Sidebar from '../../home/layouts/Sidebar';
import Navbar from '../../home/layouts/Navbar';
import Breadcrumbs from '@/Components/common/Breadcrumbs';
import {
    ShieldCheck,
    Search,
    ChevronRight,
    Briefcase,
    XCircle,
    MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { MentorshipStatus } from '@/types/mentorship';
import { chatApi } from '@/Services/chat.api';
import { useAppDispatch } from '@/redux/hooks';
import { setCurrentConversation } from '@/redux/slices/chatSlice';

const MyMentorshipsPage: React.FC = () => {
    const [mentorships, setMentorships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleChat = async (mentorId: string) => {
        try {
            const conversation = await chatApi.initiateChat(mentorId);
            dispatch(setCurrentConversation(conversation));
            navigate('/chat');
        } catch (error) {
            console.error('Failed to initiate chat', error);
            const errorMessage =
                (error as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message || 'Failed to start chat. Ensure mentorship is active.';
            toast.error(errorMessage);
        }
    };

    const [filter, setFilter] = useState('All');
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 9;

    useEffect(() => {
        const fetchMentorships = async () => {
            setLoading(true);
            try {
                const data = await mentorshipApi.getUserRequests();
                // Client-side sort by createdAt desc if available, assuming backend doesn't sort
                const sortedData = Array.isArray(data) ? data.reverse() : [];
                setMentorships(sortedData);
            } catch (error) {
                console.error('Failed to fetch mentorships:', error);
                const errorMessage =
                    (error as { response?: { data?: { message?: string } } })
                        ?.response?.data?.message || 'Failed to fetch mentorships';
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchMentorships();
    }, []);

    const filteredMentorships = mentorships.filter((m) => {
        const matchesSearch = m.mentorId?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (filter === 'All') return true;
        if (filter === 'Requests')
            return [
                MentorshipStatus.PENDING,
                MentorshipStatus.MENTOR_ACCEPTED,
                MentorshipStatus.USER_CONFIRMED,
                MentorshipStatus.PAYMENT_PENDING,
            ].includes(m.status);
        if (filter === 'Active')
            return [
                MentorshipStatus.ACTIVE,
                MentorshipStatus.COMPLETED,
            ].includes(m.status);
        if (filter === 'Rejected')
            return [
                MentorshipStatus.REJECTED,
                MentorshipStatus.CANCELLED,
            ].includes(m.status);
        return true;
    });

    const totalPages = Math.ceil(filteredMentorships.length / ITEMS_PER_PAGE);
    const paginatedMentorships = filteredMentorships.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case MentorshipStatus.ACTIVE:
            case MentorshipStatus.COMPLETED:
                return 'text-green-600 bg-green-50';
            case MentorshipStatus.PENDING:
            case MentorshipStatus.MENTOR_ACCEPTED:
            case MentorshipStatus.USER_CONFIRMED:
            case MentorshipStatus.PAYMENT_PENDING:
                return 'text-orange-600 bg-orange-50';
            case MentorshipStatus.REJECTED:
                return 'text-red-600 bg-red-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    const handleCancel = async (e: React.MouseEvent, mentorshipId: string) => {
        e.stopPropagation();
        if (
            confirm(
                'Are you sure you want to cancel this mentorship? Refund policies apply.'
            )
        ) {
            try {
                await mentorshipApi.cancelMentorship(mentorshipId);
                toast.success('Mentorship cancelled successfully');
                setMentorships((prev) =>
                    prev.map((m) =>
                        m._id === mentorshipId
                            ? { ...m, status: MentorshipStatus.CANCELLED }
                            : m
                    )
                );
            } catch (error) {
                const errorMessage =
                    (error as { response?: { data?: { message?: string } } })
                        ?.response?.data?.message || 'Failed to cancel';
                toast.error(errorMessage);
            }
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <header className="mb-8">
                            <Breadcrumbs />
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                My Mentorships
                            </h1>
                            <p className="text-gray-600 mb-6">
                                Manage your ongoing and past mentorships.
                            </p>

                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="relative max-w-md w-full">
                                    <Search
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search mentor by name..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7F00FF]/20 focus:border-[#7F00FF]"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setPage(1);
                                        }}
                                    />
                                </div>

                                <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                                    {[
                                        'All',
                                        'Requests',
                                        'Active',
                                        'Rejected',
                                    ].map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => {
                                                setFilter(f);
                                                setPage(1);
                                            }}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                filter === f
                                                    ? 'bg-[#7F00FF] text-white shadow-md'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </header>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7F00FF]"></div>
                            </div>
                        ) : filteredMentorships.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <div className="text-gray-400 mb-4">
                                    <ShieldCheck
                                        size={64}
                                        className="mx-auto opacity-20"
                                    />
                                </div>
                                <h3 className="text-xl font-medium text-gray-900">
                                    No mentorships found
                                </h3>
                                <button
                                    onClick={() => navigate('/mentors')}
                                    className="mt-4 px-6 py-2 bg-[#7F00FF] text-white rounded-xl hover:bg-[#6c00db] transition-colors font-medium"
                                >
                                    Find a Mentor
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    {paginatedMentorships.map((mentorship) => (
                                        <div
                                            key={mentorship._id}
                                            onClick={() =>
                                                navigate(
                                                    `/mentorship/${mentorship._id}`
                                                )
                                            }
                                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer group"
                                        >
                                            <div className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            src={
                                                                mentorship
                                                                    .mentorId
                                                                    ?.profilePic ||
                                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                                    mentorship
                                                                        .mentorId
                                                                        ?.name ||
                                                                        'Mentor'
                                                                )}`
                                                            }
                                                            alt={
                                                                mentorship
                                                                    .mentorId
                                                                    ?.name
                                                            }
                                                            className="w-16 h-16 rounded-2xl object-cover border border-gray-100"
                                                        />
                                                        <div>
                                                            <h3 className="font-bold text-gray-900 group-hover:text-[#7F00FF] transition-colors">
                                                                {
                                                                    mentorship
                                                                        .mentorId
                                                                        ?.name
                                                                }
                                                            </h3>
                                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                                <Briefcase
                                                                    size={12}
                                                                />
                                                                {mentorship
                                                                    .mentorId
                                                                    ?.expertise ||
                                                                    'Expert'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-3 mb-6">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-500">
                                                            Status
                                                        </span>
                                                        <span
                                                            className={`px-2 py-1 rounded-lg text-xs font-bold uppercase ${getStatusColor(
                                                                mentorship.status
                                                            )}`}
                                                        >
                                                            {mentorship.status.replace(
                                                                '_',
                                                                ' '
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-500">
                                                            Sessions
                                                        </span>
                                                        <span className="font-medium text-gray-900">
                                                            {
                                                                mentorship.usedSessions
                                                            }{' '}
                                                            /{' '}
                                                            {
                                                                mentorship.totalSessions
                                                            }
                                                        </span>
                                                    </div>
                                                    {mentorship.startDate && (
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-gray-500">
                                                                Started
                                                            </span>
                                                            <span className="font-medium text-gray-900">
                                                                {new Date(
                                                                    mentorship.startDate
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-[#7F00FF] font-medium text-sm group-hover:translate-x-1 transition-transform">
                                                    <div className="flex gap-4">
                                                        <span className="flex items-center gap-1">
                                                            Manage Mentorship
                                                            <ChevronRight
                                                                size={16}
                                                            />
                                                        </span>
                                                        {mentorship.status ===
                                                            MentorshipStatus.ACTIVE && (
                                                            <>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleChat(mentorship.mentorId._id);
                                                                    }}
                                                                    className="flex items-center gap-1 text-[#7F00FF] hover:text-[#6000c0] font-medium text-sm transition-colors z-10 mr-4"
                                                                >
                                                                    <MessageSquare size={16} />
                                                                    Chat
                                                                </button>
                                                                <button
                                                                    onClick={(e) =>
                                                                        handleCancel(
                                                                            e,
                                                                            mentorship._id
                                                                        )
                                                                    }
                                                                    className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium text-sm transition-colors z-10"
                                                                >
                                                                    <XCircle
                                                                        size={16}
                                                                    />
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 pb-8">
                                        <button
                                            onClick={() =>
                                                setPage((p) =>
                                                    Math.max(1, p - 1)
                                                )
                                            }
                                            disabled={page === 1}
                                            className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-sm font-medium text-gray-600 px-2">
                                            Page {page} of {totalPages}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setPage((p) =>
                                                    Math.min(totalPages, p + 1)
                                                )
                                            }
                                            disabled={page === totalPages}
                                            className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MyMentorshipsPage;

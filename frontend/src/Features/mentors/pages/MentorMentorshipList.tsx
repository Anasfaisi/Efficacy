import React, { useEffect, useState } from 'react';
import { mentorshipApi } from '@/Services/mentorship.api';
import type { Mentorship } from '@/types/mentorship';
import { MentorshipStatus, SessionStatus } from '@/types/mentorship';
import {
    Users,
    Calendar,
    Clock,
    MessageSquare,
    Search,
    ArrowRight,
} from 'lucide-react';

const MentorMentorshipList: React.FC = () => {
    const [mentorships, setMentorships] = useState<Mentorship[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'all'>(
        'active',
    );

    const fetchData = async () => {
        try {
            const data = await mentorshipApi.getMentorRequests();
            setMentorships(data);
        } catch (error) {
            console.error('Failed to fetch mentorships:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredMentorships = mentorships.filter((m) => {
        if (activeTab === 'active') return m.status === MentorshipStatus.ACTIVE;
        if (activeTab === 'completed')
            return m.status === MentorshipStatus.COMPLETED;
        return true;
    });

    // const handleConfirmSession = async (mentorshipId: string, sessionId: string) => {
    //     // This would call a service to mark session as completed
    //     // For now, let's assume we update the mentorship status if needed
    //     toast.info('Session completion feature coming soon!');
    // };

    if (loading)
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'active' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Active (
                        {
                            mentorships.filter(
                                (m) => m.status === MentorshipStatus.ACTIVE,
                            ).length
                        }
                        )
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'completed' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Completed (
                        {
                            mentorships.filter(
                                (m) => m.status === MentorshipStatus.COMPLETED,
                            ).length
                        }
                        )
                    </button>
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        All
                    </button>
                </div>

                <div className="relative w-full sm:w-64">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={16}
                    />
                    <input
                        type="text"
                        placeholder="Search student..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filteredMentorships.length === 0 ? (
                    <div className="bg-white rounded-3xl p-20 text-center border border-gray-200 shadow-sm">
                        <Users
                            size={64}
                            className="mx-auto text-gray-200 mb-6"
                        />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            No {activeTab} mentorships found
                        </h3>
                        <p className="text-gray-500">
                            Mentorships will appear here once you accept
                            requests.
                        </p>
                    </div>
                ) : (
                    filteredMentorships.map((m) => (
                        <div
                            key={m._id}
                            className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                        >
                            <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                <div className="flex items-center gap-5">
                                    <img
                                        src={
                                            m.userId?.profilePic ||
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(m.userId?.name || 'User')}`
                                        }
                                        className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-50"
                                        alt=""
                                    />
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                {m.userId?.name}
                                            </h3>
                                            <span
                                                className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${m.status === MentorshipStatus.ACTIVE ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                                            >
                                                {m.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium mb-4">
                                            {m.userId?.email}
                                        </p>

                                        <div className="flex flex-wrap gap-4">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                <Calendar
                                                    size={14}
                                                    className="text-indigo-500"
                                                />
                                                <span>
                                                    Starts:{' '}
                                                    {new Date(
                                                        m.startDate!,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                <Clock
                                                    size={14}
                                                    className="text-indigo-500"
                                                />
                                                <span>
                                                    {m.usedSessions}/
                                                    {m.totalSessions} Sessions
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="w-full sm:w-auto flex -space-x-2">
                                        {[...Array(3)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-600"
                                            >
                                                S{i + 1}
                                            </div>
                                        ))}
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-400">
                                            +{m.totalSessions - 3}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <button className="flex-1 sm:flex-none px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors font-bold text-sm flex items-center justify-center gap-2">
                                            <MessageSquare size={16} /> Chat
                                        </button>
                                        <button className="flex-1 sm:flex-none px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-100">
                                            Manage <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Expandable Session List Placeholder */}
                            <div className="px-8 pb-8 pt-4 border-t border-gray-50 bg-gray-50/30">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                                    Upcoming Sessions
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {m.sessions
                                        .filter(
                                            (s) =>
                                                s.status ===
                                                SessionStatus.BOOKED,
                                        )
                                        .slice(0, 2)
                                        .map((session) => (
                                            <div
                                                key={session._id}
                                                className="px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
                                            >
                                                <div className="text-center border-r border-gray-100 pr-4">
                                                    <p className="text-[10px] font-black text-indigo-400 uppercase leading-none mb-1">
                                                        {new Date(
                                                            session.date,
                                                        ).toLocaleString(
                                                            'default',
                                                            { month: 'short' },
                                                        )}
                                                    </p>
                                                    <p className="text-sm font-black text-gray-900 leading-none">
                                                        {new Date(
                                                            session.date,
                                                        ).getDate()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-900">
                                                        {new Date(
                                                            session.date,
                                                        ).toLocaleTimeString(
                                                            [],
                                                            {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            },
                                                        )}
                                                    </p>
                                                    <button className="text-[10px] font-black text-[#7F00FF] hover:underline">
                                                        Mark Complete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    {m.sessions.filter(
                                        (s) =>
                                            s.status === SessionStatus.BOOKED,
                                    ).length === 0 && (
                                        <p className="text-xs text-gray-400 font-medium italic">
                                            No sessions scheduled by student
                                            yet.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MentorMentorshipList;

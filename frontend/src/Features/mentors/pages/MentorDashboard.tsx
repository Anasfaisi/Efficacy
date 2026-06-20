import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { useNavigate } from 'react-router-dom';
import { type Mentor, type User } from '@/types/auth';
import { toast } from 'sonner';
import { mentorApi } from '@/Services/mentor.api';
import { mentorshipApi } from '@/Services/mentorship.api';
import { walletApi } from '@/Services/wallet.api';
import {
    Users,
    Calendar,
    UserCircle,
    Upload,
    AlertCircle,
    TrendingUp,
    Star,
} from 'lucide-react';
import Breadcrumbs from '@/Components/common/Breadcrumbs';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';
import type { Mentorship, ISession } from '@/types/mentorship';

interface Transaction {
    _id: string;
    amount: number;
    type: 'earning' | 'withdrawal' | 'refund';
    status: 'pending' | 'completed' | 'failed';
    description: string;
    date: string;
}

const MentorDashboard: React.FC = () => {
    const { currentUser } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();
    const [fetchedMentor, setFetchedMentor] = useState<Mentor | null>(null);
    const [mentorships, setMentorships] = useState<Mentorship[]>([]);
    const [revenueData, setRevenueData] = useState<
        { month: string; revenue: number }[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);

    const mentor = fetchedMentor || (currentUser as Mentor);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                console.log('jh-===========');
                setIsLoading(true);
                const [profileData, requestsData, transactionsData] =
                    await Promise.all([
                        mentorApi.getMentorProfile(),
                        mentorshipApi.getMentorRequests(1, 100),
                        walletApi.getTransactions(1, 100),
                    ]);
                console.log(requestsData, 'from md 42');

                setFetchedMentor(profileData);
                const fetchedMentorships = requestsData.mentorships || [];
                setMentorships(fetchedMentorships);

                // Process Transactions for Graph
                const transactions: Transaction[] =
                    transactionsData.transactions || [];
                const earnings = transactions.filter(
                    (t) => t.type === 'earning' && t.status === 'completed'
                );

                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const revenueAgg = [];
                for (let i = 5; i >= 0; i--) {
                    const d = new Date();
                    d.setMonth(d.getMonth() - i);
                    const monthIndex = d.getMonth();
                    const monthEarnings = earnings.filter(
                        (t) => new Date(t.date).getMonth() === monthIndex
                    );
                    const totalMonthRevenue = monthEarnings.reduce(
                        (acc, curr) => acc + curr.amount,
                        0
                    );
                    revenueAgg.push({
                        month: monthNames[monthIndex],
                        revenue: totalMonthRevenue,
                    });
                }
                setRevenueData(revenueAgg);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (currentUser?.role === 'mentor') {
            const status = (currentUser as Mentor).status;
            fetchDashboardData();

            if (status === 'incomplete' || !status || status === 'reapply') {
                setIsLoading(false);
                navigate('/mentor/onboarding');
            } else if (status === 'pending') {
                setIsLoading(false);
                navigate('/mentor/application-received');
            } else if (status === 'approved') {
                fetchDashboardData();
            } else if (status === 'rejected') {
                setIsLoading(false);
                navigate('/mentor/application-rejected');
            } else if (status === 'inactive') {
                setIsLoading(false);
                toast.error(
                    'Your account is currently inactive. Please contact support.'
                );
                navigate('/mentor/login');
            } else {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }, [currentUser, navigate]);

    // Extract all upcoming sessions from active mentorships
    const activeMentorships = mentorships.filter((m) => m.status === 'active');
    const upcomingSessions: {
        session: ISession;
        user: User | string;
        mentorshipId: string;
    }[] = [];

    activeMentorships.forEach((m) => {
        if (m.sessions) {
            m.sessions.forEach((s) => {
                if (s.status === 'booked' && new Date(s.date) >= new Date()) {
                    upcomingSessions.push({
                        session: s,
                        user: m.userId,
                        mentorshipId: m._id || '',
                    });
                }
            });
        }
    });

    upcomingSessions.sort(
        (a, b) =>
            new Date(a.session.date).getTime() -
            new Date(b.session.date).getTime()
    );

    // Extract recent completed mentorships
    const recentMentorships = mentorships
        .filter((m) => m.status === 'completed' || m.status === 'active')
        .sort(
            (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
        )
        .slice(0, 5);

    const uniqueMentees = new Set(
        mentorships.map((m) =>
            typeof m.userId === 'string' ? m.userId : (m.userId as User)._id
        )
    ).size;

    if (!currentUser) return null;

    if (isLoading && !fetchedMentor) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 font-sans bg-[#f8fafc] min-h-screen p-2">
            <Breadcrumbs />

            {/* Profile Picture Reminder */}
            {!mentor.profilePic && (
                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-[inset_0_2px_10px_rgba(255,255,255,0.6),0_10px_30px_rgba(0,0,0,0.05)] border border-white/50 animate-in slide-in-from-top-4 duration-500">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-indigo-50/80 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.05),0_4px_10px_rgba(99,102,241,0.2)]">
                                <UserCircle className="w-8 h-8 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">
                                    Complete your profile
                                </h3>
                                <p className="text-slate-500 text-sm mt-1 font-medium">
                                    Add a profile picture to make your profile
                                    stand out to potential mentees.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/mentor/profile')}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-2xl transition-all shadow-[0_4px_12px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_16px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 flex items-center gap-2"
                        >
                            <Upload size={18} />
                            Upload Photo
                        </button>
                    </div>
                </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Mentees"
                    value={uniqueMentees.toString()}
                    icon={<Users className="w-6 h-6 text-blue-600" />}
                    trend="All time"
                    bgColor="bg-blue-50"
                />
                <StatCard
                    title="Upcoming Sessions"
                    value={upcomingSessions.length.toString()}
                    icon={<Calendar className="w-6 h-6 text-purple-600" />}
                    trend={
                        upcomingSessions.length > 0
                            ? `Next on ${new Date(upcomingSessions[0].session.date).toLocaleDateString()}`
                            : 'No upcoming sessions'
                    }
                    bgColor="bg-purple-50"
                />
                <StatCard
                    title="Sessions Completed"
                    value={(mentor.sessionsCompleted || 0).toString()}
                    icon={<UserCircle className="w-6 h-6 text-orange-600" />}
                    trend={`${mentor.reviewCount || 0} reviews`}
                    bgColor="bg-orange-50"
                />
                <StatCard
                    title="Average Rating"
                    value={(mentor.rating || 0).toFixed(1)}
                    icon={<Star className="w-6 h-6 text-yellow-600" />}
                    trend="Based on mentee feedback"
                    bgColor="bg-yellow-50"
                />
            </div>

            {/* Revenue Overview Graph */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/50 p-8 shadow-[inset_0_2px_10px_rgba(255,255,255,0.6),0_10px_30px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                            <div className="p-2.5 bg-emerald-50 rounded-xl shadow-[inset_0_-2px_4px_rgba(0,0,0,0.05)]">
                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                            </div>
                            Earnings Overview
                        </h3>
                        <p className="text-slate-500 text-sm mt-1 font-medium ml-12">
                            Last 6 months revenue
                        </p>
                    </div>
                    <div className="px-4 py-2 bg-slate-100 rounded-xl text-sm font-semibold text-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                        Monthly
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={revenueData}
                            margin={{
                                top: 10,
                                right: 10,
                                left: -20,
                                bottom: 0,
                            }}
                        >
                            <defs>
                                <linearGradient
                                    id="colorRevenue"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#10b981"
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#10b981"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#e2e8f0"
                            />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: '#64748b',
                                    fontSize: 13,
                                    fontWeight: 500,
                                }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: '#64748b',
                                    fontSize: 13,
                                    fontWeight: 500,
                                }}
                                dx={-10}
                                tickFormatter={(value) => `₹${value}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '16px',
                                    border: '1px solid rgba(255,255,255,0.5)',
                                    boxShadow:
                                        '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                                    backgroundColor:
                                        'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(10px)',
                                    fontWeight: 600,
                                    color: '#1e293b',
                                }}
                                formatter={(value: number) => [
                                    `₹${value}`,
                                    'Earnings',
                                ]}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#10b981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                                activeDot={{
                                    r: 6,
                                    strokeWidth: 0,
                                    fill: '#10b981',
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Quick Actions / Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/50 p-8 shadow-[inset_0_2px_10px_rgba(255,255,255,0.6),0_10px_30px_rgba(0,0,0,0.05)] min-h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-slate-800">
                            Recent Mentorships
                        </h3>
                        <button
                            onClick={() => navigate('/mentor/requests')}
                            className="text-indigo-600 text-sm font-bold hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors"
                        >
                            View All
                        </button>
                    </div>
                    {recentMentorships.length > 0 ? (
                        <div className="space-y-5">
                            {recentMentorships.map((mentorship, index) => {
                                const user =
                                    typeof mentorship.userId === 'object'
                                        ? mentorship.userId
                                        : ({
                                              name: 'Unknown',
                                              _id: mentorship.userId,
                                          } as User);
                                return (
                                    <div
                                        key={index}
                                        className="p-5 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all flex flex-col gap-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-lg shadow-[inset_0_-2px_4px_rgba(0,0,0,0.05)]">
                                                    {user?.name?.charAt(0) ||
                                                        'U'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-base">
                                                        {user?.name ||
                                                            'Unknown Student'}
                                                    </p>
                                                    <p className="text-sm font-medium text-slate-500">
                                                        {
                                                            mentorship.totalSessions
                                                        }{' '}
                                                        Sessions Plan
                                                    </p>
                                                </div>
                                            </div>
                                            <span
                                                className={`px-4 py-1.5 text-xs font-bold rounded-xl shadow-sm ${
                                                    mentorship.status ===
                                                    'completed'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                        : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                                }`}
                                            >
                                                {mentorship.status.toUpperCase()}
                                            </span>
                                        </div>

                                        {/* Ratings & Reviews Section */}
                                        {mentorship.userFeedback && (
                                            <div className="mt-2 p-4 bg-slate-50 rounded-2xl border border-slate-100/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map(
                                                            (_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-4 h-4 ${i < mentorship.userFeedback!.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`}
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded-lg shadow-sm">
                                                        {
                                                            mentorship
                                                                .userFeedback
                                                                .rating
                                                        }
                                                        .0
                                                    </span>
                                                </div>
                                                {mentorship.userFeedback
                                                    .comment && (
                                                    <p className="text-sm text-slate-600 font-medium italic">
                                                        "
                                                        {
                                                            mentorship
                                                                .userFeedback
                                                                .comment
                                                        }
                                                        "
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-5 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.02)]">
                                <Calendar className="text-slate-300 w-10 h-10" />
                            </div>
                            <p className="text-slate-500 font-semibold text-lg">
                                No recent mentorships
                            </p>
                            <button
                                onClick={() => navigate('/mentor/profile')}
                                className="mt-6 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                            >
                                Update Availability
                            </button>
                        </div>
                    )}
                </div>

                {/* Upcoming Sidebar */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/50 p-8 shadow-[inset_0_2px_10px_rgba(255,255,255,0.6),0_10px_30px_rgba(0,0,0,0.05)]">
                    <h3 className="text-xl font-bold text-slate-800 mb-8">
                        Upcoming Sessions
                    </h3>
                    <div className="space-y-4">
                        {upcomingSessions.slice(0, 4).map((item, index) => {
                            const user =
                                typeof item.user === 'object'
                                    ? item.user
                                    : ({ name: 'Unknown Student' } as User);
                            return (
                                <div
                                    key={index}
                                    className="p-5 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all group"
                                >
                                    <p className="text-sm font-bold text-indigo-600 mb-2 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(
                                            item.session.date
                                        ).toLocaleDateString()}
                                    </p>
                                    <p className="font-bold text-slate-800 mb-1">
                                        {item.session.slot}
                                    </p>
                                    <p className="text-sm font-medium text-slate-500">
                                        with {user.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                                        <span className="text-xs text-slate-600 font-bold">
                                            Confirmed
                                        </span>
                                    </div>
                                </div>
                            );
                        })}

                        {upcomingSessions.length === 0 && (
                            <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 backdrop-blur-sm">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-indigo-900">
                                            No Upcoming Sessions
                                        </p>
                                        <p className="text-xs font-medium text-indigo-700/80 mt-1.5 leading-relaxed">
                                            Keep an eye on requests!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {!mentor.bio && (
                            <div className="p-5 bg-orange-50/80 rounded-2xl border border-orange-100 backdrop-blur-sm mt-5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5)]">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-orange-900">
                                            Complete Profile
                                        </p>
                                        <p className="text-xs font-medium text-orange-800 mt-1.5 leading-relaxed">
                                            Add your bio and skills to get
                                            better matches.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({
    title,
    value,
    icon,
    trend,
    bgColor,
}: {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend: string;
    bgColor: string;
}) => (
    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-7 border border-white/50 shadow-[inset_0_2px_10px_rgba(255,255,255,0.6),0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_2px_10px_rgba(255,255,255,0.6),0_15px_35px_rgba(0,0,0,0.08)] transition-all group">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-bold text-slate-500 mb-1">{title}</p>
                <h4 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                    {value}
                </h4>
            </div>
            <div
                className={`p-3.5 ${bgColor} rounded-2xl shadow-[inset_0_-2px_4px_rgba(0,0,0,0.05)] transition-transform group-hover:scale-110 duration-300`}
            >
                {icon}
            </div>
        </div>
        <div className="mt-5 flex items-center gap-2">
            <span className="text-emerald-600 text-xs font-extrabold bg-emerald-50 px-2.5 py-1 rounded-xl shadow-sm border border-emerald-100/50">
                ↑
            </span>
            <span className="text-xs text-slate-500 font-semibold">
                {trend}
            </span>
        </div>
    </div>
);

export default MentorDashboard;

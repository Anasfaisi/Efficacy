import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import type { RootState } from '@/redux/store';
import {
    Users,
    UserCheck,
    IndianRupee,
    Trophy,
    Star,
    TrendingUp,
} from 'lucide-react';
import { adminService } from '@/Services/admin.api';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface DashboardStats {
    totalUsers: number;
    totalMentors: number;
    totalRevenue: number;
}

// Dummy data for revenue graph
const revenueData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 5000 },
    { month: 'Apr', revenue: 4500 },
    { month: 'May', revenue: 6000 },
    { month: 'Jun', revenue: 7000 },
];

// Dummy data for top mentors
const topMentors = [
    {
        id: 1,
        name: 'Ann Marie',
        domain: 'Frontend Development',
        rating: 4.9,
        sessions: 120,
        image: 'https://i.pravatar.cc/150?u=1',
    },
    {
        id: 2,
        name: 'Alice Smith',
        domain: 'Data Science',
        rating: 4.8,
        sessions: 95,
        image: 'https://i.pravatar.cc/150?u=2',
    },
    {
        id: 3,
        name: 'Sindhu',
        domain: 'UI/UX Design',
        rating: 4.8,
        sessions: 80,
        image: 'https://i.pravatar.cc/150?u=3',
    },
    {
        id: 4,
        name: 'Ramya krish',
        domain: 'Backend Development',
        rating: 4.7,
        sessions: 70,
        image: 'https://i.pravatar.cc/150?u=4',
    },
    {
        id: 5,
        name: 'Eva Green',
        domain: 'Product Management',
        rating: 4.7,
        sessions: 65,
        image: 'https://i.pravatar.cc/150?u=5',
    },
];

// Dummy data for top badge holding users
const topBadgeUsers = [
    {
        id: 1,
        name: 'Michael Lee',
        badges: 15,
        currentStreak: 30,
        image: 'https://i.pravatar.cc/150?u=6',
    },
    {
        id: 2,
        name: 'Sarah Connor',
        badges: 12,
        currentStreak: 25,
        image: 'https://i.pravatar.cc/150?u=7',
    },
    {
        id: 3,
        name: 'David Kim',
        badges: 10,
        currentStreak: 15,
        image: 'https://i.pravatar.cc/150?u=8',
    },
    {
        id: 4,
        name: 'Shane Watson',
        badges: 8,
        currentStreak: 10,
        image: 'https://i.pravatar.cc/150?u=9',
    },
    {
        id: 5,
        name: 'James Smith',
        badges: 7,
        currentStreak: 5,
        image: 'https://i.pravatar.cc/150?u=10',
    },
];

const AdminDashboard: React.FC = () => {
    const { currentUser } = useAppSelector((state: RootState) => state.auth);
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalMentors: 0,
        totalRevenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminService.getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen text-gray-800 font-sans">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Admin Dashboard
                </h1>
                <p className="mt-1 text-gray-500">
                    Welcome back,{' '}
                    <span className="font-medium text-gray-700">{'Admin'}</span>
                    . Here's what's happening today.
                </p>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1 leading-none">
                            Total Users
                        </p>
                        <h2 className="text-3xl font-bold text-gray-900">
                            {loading ? '...' : stats.totalUsers}
                        </h2>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl">
                        <Users className="w-8 h-8 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1 leading-none">
                            Total Mentors
                        </p>
                        <h2 className="text-3xl font-bold text-gray-900">
                            {loading ? '...' : stats.totalMentors}
                        </h2>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-xl">
                        <UserCheck className="w-8 h-8 text-indigo-600" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1 leading-none">
                            Total Revenue
                        </p>
                        <h2 className="text-3xl font-bold text-gray-900">
                            {loading
                                ? '...'
                                : `₹${stats.totalRevenue.toLocaleString()}`}
                        </h2>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-xl">
                        <IndianRupee className="w-8 h-8 text-emerald-600" />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Revenue Graph */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                            Revenue Overview
                        </h3>
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            +12% from last month
                        </span>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={revenueData}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
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
                                    stroke="#e5e7eb"
                                />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    dx={-10}
                                    tickFormatter={(value) => `₹${value}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow:
                                            '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    }}
                                    formatter={(value: unknown) => [
                                        `₹${value as number}`,
                                        'Revenue',
                                    ]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Badge Holders */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            Top Collectors
                        </h3>
                    </div>
                    <div className="flex-1 flex flex-col gap-4">
                        {topBadgeUsers.map((user, idx) => (
                            <div
                                key={user.id}
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                <div className="relative">
                                    <img
                                        src={user.image}
                                        alt={user.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                    {idx < 3 && (
                                        <span
                                            className={`absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm ${idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-gray-400' : 'bg-amber-600'}`}
                                        >
                                            {idx + 1}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {user.currentStreak} day streak
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                                        <Trophy className="w-3 h-3" />
                                        {user.badges}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Mentors */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Star className="w-5 h-5 text-blue-500 fill-blue-500/20" />
                        Top Mentors Leaders
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {topMentors.map((mentor) => (
                        <div
                            key={mentor.id}
                            className="group relative bg-white border border-gray-100 rounded-xl p-5 text-center transition-all duration-300 hover:border-blue-100 hover:shadow-lg hover:-translate-y-1"
                        >
                            <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full text-amber-600 text-xs font-bold">
                                <Star className="w-3 h-3 fill-amber-500" />
                                {mentor.rating}
                            </div>
                            <img
                                src={mentor.image}
                                alt={mentor.name}
                                className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-gray-50 group-hover:border-blue-50 transition-colors"
                            />
                            <h4 className="text-sm font-bold text-gray-900 mb-1">
                                {mentor.name}
                            </h4>
                            <p className="text-xs text-gray-500 mb-3 truncate px-2">
                                {mentor.domain}
                            </p>
                            <div className="w-full bg-gray-50 py-2 rounded-lg text-xs font-medium text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                                {mentor.sessions} Sessions
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default AdminDashboard;

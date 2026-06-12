import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import {
    Plus,
    Timer,
    Music,
    Users,
    CheckCircle2,
    Flame,
    Award,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { User } from '@/types/auth';
import type { IPlannerTask } from '@/Features/users/planner/types';
import type { Booking } from '@/types/booking';
import type { UserBadge } from '@/types/gamification';
import { getPlannerTasks } from '@/Services/planner.api';
import { getDailyPomodoroStats } from '@/Services/pomodoro.api';
import { bookingApi } from '@/Services/booking.api';
import { userBadgeApi } from '@/Services/Gamification/userBadge.api';

const UserDashboard: React.FC = () => {
    const { currentUser } = useAppSelector((state) => state.auth);
    const user = currentUser as User;
    const userName = user?.name || 'User';
    const navigate = useNavigate();

    const [tasks, setTasks] = useState<IPlannerTask[]>([]);
    const [productiveTime, setProductiveTime] = useState<number>(0);
    const [upcomingSessions, setUpcomingSessions] = useState<Booking[]>([]);
    const [badges, setBadges] = useState<UserBadge[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Planner Tasks
                const fetchedTasks = await getPlannerTasks();
                const activeTasks = fetchedTasks
                    .filter((t) => !t.completed)
                    .slice(0, 3);
                setTasks(activeTasks);

                // Fetch Productive Time
                const today = new Date().toISOString().split('T')[0];
                try {
                    const stats = await getDailyPomodoroStats(today);
                    setProductiveTime(stats?.totalFocusTime || 0);
                } catch (e) {
                    setProductiveTime(0);
                }

                // Fetch Bookings
                try {
                    const bookingsRes = await bookingApi.getUserBookings(
                        1,
                        10,
                        'confirmed'
                    );
                    setUpcomingSessions(bookingsRes.bookings.slice(0, 3));
                } catch (e) {
                    setUpcomingSessions([]);
                }

                // Fetch Badges
                try {
                    const userBadges = await userBadgeApi.getUserBadges();
                    const badgesArray = Array.isArray(userBadges)
                        ? userBadges
                        : ((userBadges as unknown as { data: UserBadge[] }).data || []);
                    setBadges(badgesArray.slice(0, 3));
                } catch (e) {
                    setBadges([]);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            }
        };
        fetchData();
    }, []);

    const formatTime = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#7F00FF] to-[#E100FF] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-[#7F00FF]/25 border border-white/10 clay-card">
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black mb-2 tracking-tight">
                            Welcome Back, {userName}!
                        </h1>
                        <p className="text-white/80 font-medium">
                            Let's make today productive with Efficacy.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <img
                            src="https://cdni.iconscout.com/illustration/premium/thumb/student-reading-book-while-sitting-on-couch-5431872-4522814.png"
                            alt="Welcome"
                            className="w-40 h-40 object-contain drop-shadow-2xl animate-float"
                        />
                    </div>
                </div>
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-10 -top-10 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Tasks & Quick Actions */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Active Tasks */}
                    <section>
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                <CheckCircle2
                                    className="text-[#7F00FF]"
                                    size={24}
                                    strokeWidth={3}
                                />{' '}
                                Your Active Tasks
                            </h2>
                            <Link
                                to="/tasks"
                                className="text-sm font-bold text-[#7F00FF] hover:text-[#6c00db] transition-colors"
                            >
                                View All Tasks
                            </Link>
                        </div>
                        <div className="clay-card p-6 space-y-4">
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <div
                                        key={task._id}
                                        onClick={() => navigate('/planner')}
                                        className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-2xl group hover:bg-[#7F00FF]/5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-2 h-10 rounded-full transition-opacity ${
                                                    task.priority === 'High'
                                                        ? 'bg-red-500'
                                                        : task.priority === 'Medium'
                                                          ? 'bg-orange-500'
                                                          : 'bg-green-500'
                                                }`}
                                            />
                                            <div>
                                                <h3 className="font-bold text-gray-800">
                                                    {task.title}
                                                </h3>
                                                <p className="text-xs font-semibold text-gray-400">
                                                    Due: {formatDate(task.endDate)}
                                                </p>
                                            </div>
                                        </div>
                                        <button className="clay-btn px-5 py-2 bg-white text-[#7F00FF] border border-[#7F00FF]/20 text-xs font-black rounded-xl">
                                            Go to Task
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-gray-400 font-medium">
                                    No active tasks. Time to relax or plan ahead!
                                </div>
                            )}
                            <div className="pt-2 text-center">
                                <button
                                    onClick={() => navigate('/tasks')}
                                    className="clay-btn px-8 py-3 bg-orange-500 text-white font-black rounded-2xl"
                                >
                                    Add New Task
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <section>
                        <h2 className="text-xl font-black text-gray-900 mb-4 px-2 flex items-center gap-2">
                            ⚡ Quick Actions
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <QuickActionCard
                                icon={<Plus size={26} strokeWidth={3} />}
                                label="Add Task"
                                btnLabel="Add"
                                color="bg-orange-500"
                                to="/planner"
                            />
                            <QuickActionCard
                                icon={<Timer size={26} strokeWidth={3} />}
                                label="Focus Timer"
                                btnLabel="Start"
                                color="bg-pink-500"
                                to="/pomodoro"
                            />
                            <QuickActionCard
                                icon={<Music size={26} strokeWidth={3} />}
                                label="Journal"
                                btnLabel="Notes"
                                color="bg-[#00897B]"
                                to="/notes"
                            />
                            <QuickActionCard
                                icon={<Users size={26} strokeWidth={3} />}
                                label="Add Planner"
                                btnLabel="Plan"
                                color="bg-teal-500"
                                to="/planner"
                            />
                        </div>
                    </section>
                </div>

                {/* Right Column - Schedule & Progress */}
                <div className="space-y-8">
                    {/* Your Progress */}
                    <section>
                        <h2 className="text-xl font-black text-gray-900 mb-4 px-2 flex items-center gap-2">
                            📊 Your Productive Time
                        </h2>
                        <div className="space-y-4">
                            <ProgressCard
                                label="Focus Time Today"
                                value={formatTime(productiveTime)}
                                progress={Math.min((productiveTime / 120) * 100, 100)}
                                color="bg-pink-500"
                            />
                            <ProgressCard
                                label="Active Streak"
                                value={`${user?.currentStreak || 0} Days`}
                                progress={100}
                                color="bg-orange-500"
                                icon={
                                    <Flame size={18} className="fill-orange-500 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                                }
                            />
                        </div>
                    </section>

                    {/* Upcoming Sessions */}
                    <section>
                        <h2 className="text-xl font-black text-gray-900 mb-4 px-2 flex items-center gap-2">
                            🗓️ Upcoming Sessions
                        </h2>
                        <div className="clay-card p-6">
                            {upcomingSessions.length > 0 ? (
                                <div className="space-y-4">
                                    {upcomingSessions.map((session) => (
                                        <div
                                            key={session.id}
                                            className="p-4 bg-teal-50 border-r-8 border-teal-500 rounded-2xl text-xs shadow-sm"
                                        >
                                            <div className="font-bold text-teal-800 mb-1">
                                                {session.topic || 'Mentorship Session'}
                                            </div>
                                            <div className="text-teal-600 font-semibold">
                                                {formatDate(session.bookingDate)} at {session.slot}
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => navigate('/booking/user')}
                                        className="clay-btn w-full mt-2 py-3.5 bg-teal-500 text-white font-black rounded-2xl"
                                    >
                                        View All Bookings
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-gray-400 font-medium text-sm">
                                    No upcoming sessions found.
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Achievements */}
                    <section>
                        <h2 className="text-xl font-black text-gray-900 mb-4 px-2 flex items-center gap-2">
                            🏆 Recent Achievements
                        </h2>
                        <div className="clay-card p-6">
                            {badges.length > 0 ? (
                                <div className="space-y-4">
                                    {badges.map((userBadge) => (
                                        <div
                                            key={userBadge.badgeId}
                                            className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm border border-gray-100"
                                        >
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                                                style={{ backgroundColor: userBadge.badge.design.primaryColor || '#7F00FF' }}
                                            >
                                                <Award size={20} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 text-sm">
                                                    {userBadge.badge.name}
                                                </div>
                                                <div className="text-xs text-gray-400 font-semibold">
                                                    {userBadge.badge.story}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-gray-400 font-medium text-sm">
                                    Keep working hard to unlock badges!
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

const QuickActionCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    btnLabel: string;
    color: string;
    to: string;
}> = ({ icon, label, btnLabel, color, to }) => (
    <div className="clay-card p-5 flex flex-col items-center text-center group">
        <div
            className={`${color} text-white p-4 rounded-2xl mb-4 shadow-xl ${color.replace('bg-', 'shadow-')}/40 group-hover:-translate-y-1 transition-transform`}
        >
            {icon}
        </div>
        <span className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">
            {label}
        </span>
        <Link
            to={to}
            className={`clay-btn w-full py-2.5 ${color} text-white text-xs font-black rounded-xl shadow-lg ${color.replace('bg-', 'shadow-')}/30`}
        >
            {btnLabel}
        </Link>
    </div>
);

const ProgressCard: React.FC<{
    label: string;
    value: string;
    progress: number;
    color: string;
    icon?: React.ReactNode;
}> = ({ label, value, progress, color, icon }) => (
    <div className="clay-card p-6">
        <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {label}
            </span>
            <div className="flex items-center gap-2">
                <span className="text-xl font-black text-gray-900">
                    {value}
                </span>
                {icon}
            </div>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div
                className={`h-full ${color} rounded-full transition-all duration-1000`}
                style={{ width: `${progress}%` }}
            />
        </div>
    </div>
);

export default UserDashboard;


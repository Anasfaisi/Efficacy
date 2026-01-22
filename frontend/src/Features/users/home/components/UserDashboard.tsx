import React from 'react';
import { useAppSelector } from '@/redux/hooks';
import {
    Plus,
    Timer,
    Music,
    Users,
    CheckCircle2,
    Flame,
    MessageCircle,
    Video,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { User } from '@/types/auth';
const UserDashboard: React.FC = () => {
    const { currentUser } = useAppSelector((state) => state.auth);
    const user = currentUser as User;
    const userName = user?.name || 'User';

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#7F00FF] to-[#E100FF] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-[#7F00FF]/25 border border-white/10">
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
                            className="w-40 h-40 object-contain drop-shadow-2xl"
                        />
                    </div>
                </div>
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-10 -top-10 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Tasks & Progress */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Active Tasks */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
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
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50 space-y-4">
                            {[
                                {
                                    title: 'Math Assignment',
                                    due: 'June 10, 2025',
                                },
                                {
                                    title: 'Read Chapter 5',
                                    due: 'June 12, 2025',
                                },
                                {
                                    title: 'Group Project Meeting',
                                    due: 'June 15, 2025',
                                },
                            ].map((task, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl group hover:bg-[#7F00FF]/5 transition-all duration-300 border border-transparent hover:border-[#7F00FF]/10"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-10 bg-[#7F00FF] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div>
                                            <h3 className="font-bold text-gray-800">
                                                {task.title}
                                            </h3>
                                            <p className="text-xs font-semibold text-gray-400">
                                                Due: {task.due}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="px-5 py-2 bg-[#7F00FF] text-white text-xs font-black rounded-xl hover:bg-[#6c00db] transition-all shadow-lg shadow-[#7F00FF]/30 active:scale-95">
                                        Mark as Done
                                    </button>
                                </div>
                            ))}
                            <div className="pt-2 text-center">
                                <button className="px-8 py-3 bg-orange-500 text-white font-black rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/30 active:scale-95">
                                    Add Task
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <section>
                        <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                            ⚡ Quick Actions
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <QuickActionCard
                                icon={<Plus size={26} strokeWidth={3} />}
                                label="Add Task"
                                btnLabel="Add"
                                color="bg-orange-500"
                                to="/tasks"
                            />
                            <QuickActionCard
                                icon={<Timer size={26} strokeWidth={3} />}
                                label="Focus Timer"
                                btnLabel="Start"
                                color="bg-pink-500"
                                to="#"
                            />
                            <QuickActionCard
                                icon={<Music size={26} strokeWidth={3} />}
                                label="Play Music"
                                btnLabel="Play"
                                color="bg-[#00897B]"
                                to="#"
                            />
                            <QuickActionCard
                                icon={<Users size={26} strokeWidth={3} />}
                                label="Mentor Support"
                                btnLabel="Join"
                                color="bg-teal-500"
                                to="/mentors"
                            />
                        </div>
                    </section>
                </div>

                {/* Right Column - Schedule & Progress */}
                <div className="space-y-8">
                    {/* Schedule & Reminders */}
                    <section>
                        <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                            🗓️ Your Schedule & Reminders
                        </h2>
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                            <div className="mb-6">
                                <h3 className="text-sm font-black text-gray-400 mb-4 uppercase tracking-widest">
                                    Mini Calendar
                                </h3>
                                <div className="grid grid-cols-7 gap-2 text-center">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(
                                        (d) => (
                                            <div
                                                key={d}
                                                className="text-[11px] font-black text-gray-300"
                                            >
                                                {d}
                                            </div>
                                        ),
                                    )}
                                    {Array.from(
                                        { length: 21 },
                                        (_, i) => i + 1,
                                    ).map((d) => (
                                        <div
                                            key={d}
                                            className={`text-xs font-bold w-8 h-8 flex items-center justify-center rounded-xl transition-all cursor-default ${d === 15 ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40' : d === 8 ? 'bg-orange-100 text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}
                                        >
                                            {d}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">
                                    Reminders
                                </h3>
                                <div className="p-4 bg-orange-50 border-r-8 border-orange-500 rounded-2xl text-xs font-bold text-orange-700 shadow-sm">
                                    Submit Essay - June 09, 2025
                                </div>
                                <div className="p-4 bg-teal-50 border-r-8 border-teal-500 rounded-2xl text-xs font-bold text-teal-700 shadow-sm">
                                    Study Session - June 10, 2025
                                </div>
                                <button className="w-full mt-2 py-3.5 bg-orange-500 text-white font-black rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/40 active:scale-95">
                                    Sync Calendar
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Your Progress */}
                    <section>
                        <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                            📊 Your Progress
                        </h2>
                        <div className="space-y-4">
                            <ProgressCard
                                label="Tasks Completed"
                                value="5/10"
                                progress={50}
                                color="bg-[#7F00FF]"
                            />
                            <ProgressCard
                                label="Focus Time"
                                value="3h 45m"
                                progress={75}
                                color="bg-pink-500"
                            />
                            <ProgressCard
                                label="Streak"
                                value="7 Days"
                                progress={100}
                                color="bg-orange-500"
                                icon={
                                    <Flame size={18} className="fill-white" />
                                }
                            />
                        </div>
                    </section>
                </div>
            </div>

            {/* Collaboration Section */}
            <section>
                <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                    🤝 Collaborate with Peers
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                    <CollabCard
                        title="Chat with Peers"
                        desc="Message your study group and share resources instantly."
                        to="/chat"
                        btnText="Open Chat"
                        icon={<MessageCircle size={32} />}
                    />
                    <CollabCard
                        title="Join a Call"
                        desc="Start a voice or video call with peers to study together."
                        to="#"
                        btnText="Join Now"
                        icon={<Video size={32} />}
                    />
                </div>
            </section>
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
    <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col items-center text-center hover:scale-[1.05] transition-all duration-300 group">
        <div
            className={`${color} text-white p-4 rounded-2xl mb-4 shadow-2xl ${color.replace('bg-', 'shadow-')}/40 group-hover:rotate-6 transition-transform`}
        >
            {icon}
        </div>
        <span className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">
            {label}
        </span>
        <Link
            to={to}
            className={`w-full py-2.5 ${color} text-white text-xs font-black rounded-xl shadow-lg ${color.replace('bg-', 'shadow-')}/30 hover:brightness-110 active:scale-95 transition-all`}
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
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
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
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
                className={`h-full ${color} rounded-full shadow-lg transition-all duration-1000`}
                style={{ width: `${progress}%` }}
            />
        </div>
    </div>
);

const CollabCard: React.FC<{
    title: string;
    desc: string;
    to: string;
    btnText: string;
    icon: React.ReactNode;
}> = ({ title, desc, to, btnText, icon }) => (
    <div className="bg-white rounded-4xl border border-gray-100 shadow-2xl shadow-gray-200/60 overflow-hidden flex flex-col group">
        <div className="bg-[#009688] p-5 text-white flex justify-between items-center">
            <span className="text-lg font-black tracking-tight">{title}</span>
            <div className="opacity-40 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                {icon}
            </div>
        </div>
        <div className="p-8 flex-1 flex flex-col justify-between">
            <p className="text-sm font-semibold text-gray-400 leading-relaxed mb-8">
                {desc}
            </p>
            <Link
                to={to}
                className="w-full py-4 bg-[#009688] text-white font-black rounded-2xl text-center hover:bg-[#00796b] transition-all shadow-xl shadow-[#009688]/40 active:scale-[0.98]"
            >
                {btnText}
            </Link>
        </div>
    </div>
);

export default UserDashboard;

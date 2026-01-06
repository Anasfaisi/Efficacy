import { useState, useEffect } from 'react';
import { adminService } from '@/Services/admin.api';
import type { MentorApplication } from '../types';
import {
    Search,
    Loader2,
    User,
    Mail,
    ChevronRight,
    BadgeCheck,
    Clock,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function MentorApplicationsPage() {
    const [applications, setApplications] = useState<MentorApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const data = await adminService.getMentorApplications();
            setApplications(data);
        } catch (error) {
            console.error('Failed to fetch applications', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredApplications = applications.filter(
        (app) =>
            app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    console.log(filteredApplications, 'filteredApplications=================');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'approved':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'rejected':
                return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'reapply':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'active':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'inactive':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Mentor Applications
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Review and manage incoming mentor applications
                    </p>
                </div>
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search applications..."
                        className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full sm:w-64 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">
                        Loading applications...
                    </p>
                </div>
            ) : filteredApplications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="text-gray-400" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        No applications found
                    </h3>
                    <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                        There are currently no mentor applications or none
                        matching your search.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredApplications.map((app) => (
                        <div
                            key={app._id}
                            onClick={() =>
                                navigate(`/admin/mentors/review/${app.id}`)
                            }
                            className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-inner group-hover:scale-110 transition-transform">
                                    <User size={26} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-gray-900 text-lg tracking-tight">
                                            {app.name}
                                        </h3>
                                        <span
                                            className={cn(
                                                'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border',
                                                getStatusColor(app.status),
                                            )}
                                        >
                                            {app.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1.5">
                                            <Mail
                                                size={14}
                                                className="text-gray-400"
                                            />
                                            {app.email}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <BadgeCheck
                                                size={14}
                                                className="text-blue-500"
                                            />
                                            {app.mentorType} Mentor
                                        </div>
                                        {app.createdAt && (
                                            <div className="flex items-center gap-1.5 font-medium">
                                                <Clock
                                                    size={14}
                                                    className="text-amber-500"
                                                />
                                                {new Date(
                                                    app.createdAt,
                                                ).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 pl-14 sm:pl-0">
                                <button className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                    Review
                                </button>
                                <ChevronRight
                                    className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
                                    size={20}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

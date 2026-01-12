import { useState, useEffect } from 'react';
import {
    Search,
    Mail,
    MapPin,
    MoreVertical,
    UserCheck,
    UserX,
    Edit,
    Eye,
    Award,
} from 'lucide-react';
import type { Mentor } from '@/types/auth';
import { adminService } from '@/Services/admin.api';
import { useNavigate } from 'react-router-dom';

const MentorMangement = () => {
    const navigate = useNavigate();
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<
        'all' | 'active' | 'inactive'
    >('all');
    const [filterType, setFilterType] = useState<
        'all' | 'Academic' | 'Industry'
    >('all');

    useEffect(() => {
        fetchMentors();
    }, []);

    const fetchMentors = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllMentors();
            setMentors(data);
        } catch (error) {
            console.error('Failed to fetch mentors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            await adminService.updateMentorStatus(id, newStatus);
            fetchMentors();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const filteredMentors = mentors.filter((m) => {
        const matchesSearch =
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            filterStatus === 'all' || m.status === filterStatus;
        const matchesType = filterType === 'all' || m.mentorType === filterType;
        return matchesSearch && matchesStatus && matchesType;
    });

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Mentor Management
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Manage and monitor all mentors on the platform
                    </p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <select
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        value={filterStatus}
                        onChange={(e) =>
                            setFilterStatus(
                                e.target.value as 'all' | 'active' | 'inactive',
                            )
                        }
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive Only</option>
                    </select>
                    <select
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        value={filterType}
                        onChange={(e) =>
                            setFilterType(
                                e.target.value as
                                    | 'all'
                                    | 'Academic'
                                    | 'Industry',
                            )
                        }
                    >
                        <option value="all">All Types</option>
                        <option value="Academic">Academic</option>
                        <option value="Industry">Industry</option>
                    </select>
                </div>
            </div>

            {/* Content Section */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="h-64 bg-gray-100 rounded-xl"
                        ></div>
                    ))}
                </div>
            ) : filteredMentors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredMentors.map((m) => (
                        <div
                            key={m.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow group relative overflow-hidden"
                        >
                            {/* Card Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg">
                                        {m.profilePic ? (
                                            <img
                                                src={m.profilePic}
                                                alt={m.name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            m.name.charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 leading-tight">
                                            {m.name}
                                        </h3>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <span
                                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                                    m.mentorType === 'Academic'
                                                        ? 'bg-purple-50 text-purple-600'
                                                        : 'bg-indigo-50 text-indigo-600'
                                                }`}
                                            >
                                                {m.mentorType || 'Mentor'}
                                            </span>
                                            <span
                                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                                    m.status === 'active'
                                                        ? 'bg-green-50 text-green-600'
                                                        : 'bg-red-50 text-red-600'
                                                }`}
                                            >
                                                {m.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                                    <MoreVertical
                                        size={18}
                                        className="text-gray-400"
                                    />
                                </button>
                            </div>

                            {/* Card Body */}
                            <div className="space-y-3 mb-5">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail size={14} className="min-w-[14px]" />
                                    <span className="truncate">{m.email}</span>
                                </div>
                                {m.expertise && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Award
                                            size={14}
                                            className="min-w-[14px]"
                                        />
                                        <span className="truncate">
                                            {m.expertise}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin
                                        size={14}
                                        className="min-w-[14px]"
                                    />
                                    <span className="truncate">
                                        {[m.city, m.country]
                                            .filter(Boolean)
                                            .join(', ') || 'Remote'}
                                    </span>
                                </div>
                            </div>

                            {/* Card Footer Actions */}
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/admin/mentors/details/${m.id}`,
                                            )
                                        }
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="View Profile"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit size={18} />
                                    </button>
                                </div>
                                <button
                                    onClick={() =>
                                        handleStatusUpdate(m.id!, m.status)
                                    }
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                        m.status === 'active'
                                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                                    }`}
                                >
                                    {m.status === 'active' ? (
                                        <UserX size={14} />
                                    ) : (
                                        <UserCheck size={14} />
                                    )}
                                    {m.status === 'active'
                                        ? 'Block'
                                        : 'Unblock'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserCheck size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        No mentors found
                    </h3>
                    <p className="text-gray-500 mt-1">
                        Try adjusting your filters or search terms
                    </p>
                </div>
            )}

            {/* Create Mentor Modal Removed */}
        </div>
    );
};

export default MentorMangement;

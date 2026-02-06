import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    User,
    Mail,
    Calendar,
    FileText,
    ArrowLeft,
    Linkedin,
    Github,
    Globe,
    GraduationCap,
    MapPin,
    Award,
    Phone,
    Video,
    UserCheck,
    UserX,
} from 'lucide-react';

import { adminService } from '@/Services/admin.api';
import type { Mentor } from '@/types/auth';
import { toast } from 'sonner';

export default function MentorDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [mentor, setMentor] = useState<Mentor | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMentor = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await adminService.getMentorById(id);
                setMentor(data);
                setError(null);
            } catch (err: unknown) {
                console.error('Failed to fetch mentor:', err);
                const errorMessage =
                    (err as { response?: { data?: { message?: string } } })
                        ?.response?.data?.message ||
                    'Failed to load mentor details.';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchMentor();
    }, [id]);

    const handleStatusUpdate = async () => {
        if (!mentor || !mentor.id) return;
        const newStatus = mentor.status === 'active' ? 'inactive' : 'active';
        try {
            await adminService.updateMentorStatus(mentor.id, newStatus);
            setMentor({ ...mentor, status: newStatus });
            toast.success(
                `Mentor ${newStatus === 'active' ? 'unblocked' : 'blocked'} successfully`
            );
        } catch (error) {
            const errorMessage =
                (error as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message || 'Failed to update status';
            toast.error(errorMessage);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse max-w-5xl mx-auto p-6">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <div className="h-40 bg-gray-200 rounded-xl"></div>
                        <div className="h-40 bg-gray-200 rounded-xl"></div>
                    </div>
                    <div className="h-64 bg-gray-200 rounded-xl"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="text-red-500 mb-4 font-bold text-xl">Error</div>
                <p className="text-gray-500 mt-2">{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!mentor) return <div>Mentor not found</div>;

    return (
        <div className="max-w-6xl mx-auto min-h-screen pb-12 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/mentorManagement')}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-800">
                                {mentor.name}
                            </h1>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                    mentor.mentorType === 'Academic'
                                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                        : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                }`}
                            >
                                {mentor.mentorType} Mentor
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">
                            Joined on{' '}
                            {mentor.createdAt
                                ? new Date(
                                      mentor.createdAt
                                  ).toLocaleDateString()
                                : 'N/A'}
                        </p>
                    </div>
                </div>
                <div className="md:ml-auto flex items-center gap-3">
                    <button
                        onClick={handleStatusUpdate}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm ${
                            mentor.status === 'active'
                                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
                                : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-100'
                        }`}
                    >
                        {mentor.status === 'active' ? (
                            <UserX size={16} />
                        ) : (
                            <UserCheck size={16} />
                        )}
                        {mentor.status === 'active'
                            ? 'Block Mentor'
                            : 'Unblock Mentor'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Card: Personal Details */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <User size={20} className="text-blue-500" />
                            Personal Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Full Name
                                </label>
                                <p className="text-gray-900 font-medium">
                                    {mentor.name}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Email
                                </label>
                                <div className="flex items-center gap-2 text-gray-900">
                                    <Mail size={14} className="text-gray-400" />
                                    {mentor.email}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Phone
                                </label>
                                <div className="flex items-center gap-2 text-gray-900">
                                    <Phone
                                        size={14}
                                        className="text-gray-400"
                                    />
                                    {mentor.phone || 'N/A'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Location
                                </label>
                                <div className="flex items-center gap-2 text-gray-900">
                                    <MapPin
                                        size={14}
                                        className="text-gray-400"
                                    />
                                    {[mentor.city, mentor.state, mentor.country]
                                        .filter(Boolean)
                                        .join(', ') || 'N/A'}
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                Bio
                            </label>
                            <p className="text-gray-700 mt-2 leading-relaxed">
                                {mentor.bio || 'No bio provided'}
                            </p>
                        </div>
                    </section>

                    {/* Card: Education & Expertise */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <GraduationCap
                                size={20}
                                className="text-blue-500"
                            />
                            Education & Expertise
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Qualification
                                </label>
                                <p className="text-gray-900 font-medium">
                                    {mentor.qualification || 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    University
                                </label>
                                <p className="text-gray-900 font-medium">
                                    {mentor.university || 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Graduation Year
                                </label>
                                <p className="text-gray-900 font-medium">
                                    {mentor.graduationYear || 'N/A'}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Domain
                                </label>
                                <p className="text-gray-900 font-medium">
                                    {mentor.domain || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Card: Branch Specific Details */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-hidden relative">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Award size={20} className="text-indigo-500" />
                            Professional Experience
                        </h2>

                        {mentor.mentorType === 'Academic' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                        Expertise
                                    </label>
                                    <p className="text-gray-900 font-medium">
                                        {mentor.expertise || 'N/A'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                        Academic Span
                                    </label>
                                    <p className="text-gray-900 font-medium">
                                        {mentor.academicSpan || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                        Industry Category
                                    </label>
                                    <p className="text-gray-900 font-medium">
                                        {mentor.industryCategory || 'N/A'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                        Current Role
                                    </label>
                                    <p className="text-gray-900 font-medium">
                                        {mentor.currentRole || 'N/A'}
                                    </p>
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                        Guidance Areas
                                    </label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {mentor.guidanceAreas?.map((area) => (
                                            <span
                                                key={area}
                                                className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded text-xs font-medium"
                                            >
                                                {area}
                                            </span>
                                        )) || 'N/A'}
                                    </div>
                                </div>
                                {mentor.skills && (
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 block">
                                            Skills
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {mentor.skills
                                                .split(',')
                                                .map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium"
                                                    >
                                                        {skill.trim()}
                                                    </span>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                </div>

                {/* Right Column - Availability & Docs */}
                <div className="space-y-8">
                    {/* Availability */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Calendar size={20} className="text-green-500" />
                            Availability
                        </h2>
                        {/* Note: availableDays comes as string or array depending on mapping. 
                 Auth Mentor interface says string, but often it's stored as array. 
                 We will robustly handle it.
             */}
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
                                    Preferred Days
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(mentor.availableDays)
                                        ? mentor.availableDays.map(
                                              (day: string) => (
                                                  <span
                                                      key={day}
                                                      className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded"
                                                  >
                                                      {day}
                                                  </span>
                                              )
                                          )
                                        : typeof mentor.availableDays ===
                                            'string'
                                          ? mentor.availableDays
                                                .split(',')
                                                .map((d: string) => (
                                                    <span
                                                        key={d}
                                                        className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded"
                                                    >
                                                        {d}
                                                    </span>
                                                ))
                                          : 'N/A'}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Socials & Video */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Globe size={20} className="text-blue-500" />
                            Socials & Media
                        </h2>
                        <div className="space-y-3">
                            {mentor.linkedin && (
                                <a
                                    href={mentor.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-all text-gray-700"
                                >
                                    <Linkedin size={18} />
                                    <span className="text-sm font-medium">
                                        LinkedIn
                                    </span>
                                </a>
                            )}
                            {mentor.github && (
                                <a
                                    href={mentor.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-900 hover:text-white transition-all text-gray-700"
                                >
                                    <Github size={18} />
                                    <span className="text-sm font-medium">
                                        GitHub
                                    </span>
                                </a>
                            )}
                            {mentor.personalWebsite && (
                                <a
                                    href={mentor.personalWebsite}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-all text-gray-700"
                                >
                                    <Globe size={18} />
                                    <span className="text-sm font-medium">
                                        Website
                                    </span>
                                </a>
                            )}
                            {mentor.demoVideoLink && (
                                <a
                                    href={mentor.demoVideoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all mt-4"
                                >
                                    <Video size={18} />
                                    <span className="text-sm font-medium">
                                        Meet Video
                                    </span>
                                </a>
                            )}
                        </div>
                    </section>

                    {/* Docs */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-orange-500" />
                            Documents
                        </h2>
                        <ul className="space-y-3">
                            {mentor.resume && (
                                <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
                                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <FileText
                                            size={16}
                                            className="text-gray-400"
                                        />{' '}
                                        Resume
                                    </span>
                                    <a
                                        href={typeof mentor.resume === 'string' ? mentor.resume : '#'}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-blue-600 font-bold hover:underline"
                                    >
                                        View
                                    </a>
                                </li>
                            )}
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    User, Mail, Briefcase, Calendar,
    FileText, Youtube, CheckCircle, XCircle, AlertCircle, ArrowLeft
} from 'lucide-react';
import type { MentorApplication } from '../types';

// Mock Data
const MOCK_DATA: MentorApplication = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Experienced software engineer with 8 years of experience in full-stack development. Passionate about mentoring and sharing knowledge.',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'System Design'],
    experienceYears: 8,
    documents: {
        resume: 'resume.pdf',
        certificate: 'degree.pdf',
        idProof: 'passport.jpg'
    },
    availability: {
        days: 'Mon, Wed, Fri',
        time: '6:00 PM - 9:00 PM EST'
    },
    videoLink: 'https://youtu.be/example123',
    status: 'pending',
    submittedAt: '2023-10-27T10:30:00Z'
};

export default function MentorReviewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [application, setApplication] = useState<MentorApplication | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectInput, setShowRejectInput] = useState(false);

    useEffect(() => {
        // Simulate API fetch
        const timer = setTimeout(() => {
            setApplication(MOCK_DATA);
            setLoading(false);
        }, 1000); // 1s loading simulation
        return () => clearTimeout(timer);
    }, [id]);

    const handleApprove = () => {
        // specific logic for approve
        alert('Mentor Approved!');
        navigate('/admin/notifications');
    };

    const handleReject = () => {
        if (!showRejectInput) {
            setShowRejectInput(true);
            return;
        }
        if (!rejectReason.trim()) return;

        // specific logic for reject
        alert(`Mentor Rejected. Reason: ${rejectReason}`);
        navigate('/admin/notifications');
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse max-w-5xl mx-auto">
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

    if (!application) return <div>Application not found</div>;

    return (
        <div className="max-w-6xl mx-auto relative min-h-[calc(100vh-100px)] flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Mentor Application Review</h1>
                    <p className="text-sm text-gray-500">Submitted on {new Date(application.submittedAt).toLocaleDateString()}</p>
                </div>
                <div className="ml-auto">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium capitalize">
                        {application.status}
                    </span>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-24">
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
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Full Name</label>
                                <p className="text-gray-900 font-medium">{application.name}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Email</label>
                                <div className="flex items-center gap-2 text-gray-900">
                                    <Mail size={14} className="text-gray-400" />
                                    {application.email}
                                </div>
                            </div>
                            {/* Add more like Phone, Location if available in type */}
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Bio</label>
                            <p className="text-gray-700 mt-2 leading-relaxed">{application.bio}</p>
                        </div>
                    </section>

                    {/* Card: Skills & Experience */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Briefcase size={20} className="text-blue-500" />
                            Skills & Experience
                        </h2>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {application.skills.map(skill => (
                                <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
                                    {skill}
                                </span>
                            ))}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Experience</label>
                            <p className="text-gray-900 font-medium">{application.experienceYears} Years</p>
                        </div>
                    </section>

                    { }
                </div>

                {/* Right Column - Availability & Docs */}
                <div className="space-y-8">
                    {/* Card: Availability */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Calendar size={20} className="text-green-500" />
                            Availability
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Preferred Days</label>
                                <p className="text-gray-900 font-medium">{application.availability.days}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Time Slots</label>
                                <p className="text-gray-900 font-medium">{application.availability.time}</p>
                            </div>
                        </div>
                    </section>

                    {/* Card: Documents */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-orange-500" />
                            Documents
                        </h2>
                        <ul className="space-y-3">
                            <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <FileText size={16} className="text-gray-400" /> Resume
                                </span>
                                <span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold">View</span>
                            </li>
                            <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <FileText size={16} className="text-gray-400" /> Certificate
                                </span>
                                <span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold">View</span>
                            </li>
                            <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <FileText size={16} className="text-gray-400" /> ID Proof
                                </span>
                                <span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold">View</span>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="sticky bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 -mx-6 md:-mx-8 lg:-mx-12 px-6 shadow-lg z-20">
                {/* Note: sticky inside overflow container needs care. 
          Actually the `AdminLayout` main has `p-6`. 
          So -mx-6 to span full width of parent.
          The parent `main` is the scroll container. Sticky bottoms stick to the bottom of the scroll container's viewport.
      */}
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-500">
                        Reviewing application <strong>#{application.id}</strong>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {showRejectInput ? (
                            <div className="flex items-center gap-2 flex-1 sm:flex-none animate-in fade-in slide-in-from-right-5 duration-200">
                                <input
                                    type="text"
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Reason for rejection..."
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 min-w-[250px]"
                                    autoFocus
                                />
                                <button
                                    onClick={() => setShowRejectInput(false)}
                                    className="text-gray-500 hover:text-gray-800 p-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReject}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                >
                                    Confirm Reject
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => alert("Request Changes clicked")}
                                    className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
                                >
                                    <AlertCircle size={16} />
                                    Request Changes
                                </button>

                                <button
                                    onClick={handleReject}
                                    className="px-5 py-2.5 rounded-lg border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors text-sm flex items-center gap-2"
                                >
                                    <XCircle size={16} />
                                    Reject
                                </button>
                            </>
                        )}

                        {!showRejectInput && (
                            <button
                                onClick={handleApprove}
                                className="px-6 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors text-sm flex items-center gap-2 shadow-md hover:shadow-lg"
                            >
                                <CheckCircle size={16} />
                                Approve Application
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

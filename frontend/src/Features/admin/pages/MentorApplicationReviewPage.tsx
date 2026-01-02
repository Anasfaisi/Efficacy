import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  User,
  Mail,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Linkedin,
  Github,
  Globe,
  GraduationCap,
  MapPin,
  Award,
  Phone,
  Video,
} from 'lucide-react';
import { toast } from 'sonner';

import type { MentorApplication } from '../types';
import { adminService } from '@/Services/admin.api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { markAsRead } from '@/redux/slices/notificationSlice';

export default function MentorReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector((state) => state.notification);
  
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<MentorApplication | null>(
    null,
  );
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasMarkedNotification = useRef(false);

  // Fetch application data
  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await adminService.getMentorApplicationById(id);
        setApplication(data);
        setError(null);
      } catch (err: unknown) {
        console.error('Failed to fetch application:', err);
        const errorMessage = (err as any).response?.data?.message || 'Failed to load application details.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  // Mark notification as read (separate effect to avoid re-running on notifications change)
  useEffect(() => {
    if (hasMarkedNotification.current) return;
    
    const markNotification = async () => {
      if (!id) return;
      
      const notificationId = searchParams.get('notificationId');
      if (notificationId) {
        try {
          await adminService.markNotificationAsRead(notificationId);
          dispatch(markAsRead(notificationId));
          hasMarkedNotification.current = true;
        } catch (error) {
          console.error('Failed to mark notification as read:', error);
        }
      } else {
        // Find and mark any unread notification related to this mentor
        const relatedNotification = notifications.find(
          (n) => !n.isRead && n.metadata?.mentorId === id
        );
        if (relatedNotification) {
          try {
            await adminService.markNotificationAsRead(relatedNotification._id);
            dispatch(markAsRead(relatedNotification._id));
            hasMarkedNotification.current = true;
          } catch (error) {
            console.error('Failed to mark notification as read:', error);
          }
        }
      }
    };

    markNotification();
  }, [id, searchParams, dispatch, notifications]);


  const handleApprove = async () => {
    if (!id) return;
    try {
      await adminService.approveMentorApplication(id);
      toast.success('Mentor application approved successfully!');
      navigate('/admin/mentors/applications');
    } catch (err: unknown) {
      const errorMessage = (err as any).response?.data?.message || 'Failed to approve application.';
      toast.error(errorMessage);
    }
  };

  const handleReject = async () => {
    if (!id) return;
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    if (!rejectReason.trim()) {
      toast.warning('Please provide a reason for rejection.');
      return;
    }

    try {
      await adminService.rejectMentorApplication(id, rejectReason);
      toast.info(`Mentor rejected: ${rejectReason}`);
      navigate('/admin/mentors/applications');
    } catch (err: unknown) {
      const errorMessage = (err as any).response?.data?.message || 'Failed to reject application.';
      toast.error(errorMessage);
    }
  };

  const handleRequestChanges = async () => {
    if (!id) return;
    const reason = prompt('Enter the changes required:'); // Ideally replace this with a modal too, but for "approve/reject all are done with alert" context, fixing alert first.
    if (!reason || !reason.trim()) return;

    try {
      await adminService.requestChangesMentorApplication(id, reason);
      toast.success('Changes requested successfully.');
      navigate('/admin/mentors/applications');
    } catch (err: unknown) {
      const errorMessage = (err as any).response?.data?.message || 'Failed to request changes.';
      toast.error(errorMessage);
    }
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">
          Error Loading Application
        </h2>
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

  if (!application) return <div>Application not found</div>;

  return (
    <div className="max-w-6xl mx-auto relative min-h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-800">
                {application.name}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  application.mentorType === 'Academic'
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                }`}
              >
                {application.mentorType} Mentor
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Submitted on{' '}
              {new Date(application.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="md:ml-auto flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
              application.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : application.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : application.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
            }`}
          >
            {application.status.replace('_', ' ')}
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
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Full Name
                </label>
                <p className="text-gray-900 font-medium">{application.name}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Email
                </label>
                <div className="flex items-center gap-2 text-gray-900">
                  <Mail size={14} className="text-gray-400" />
                  {application.email}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Phone
                </label>
                <div className="flex items-center gap-2 text-gray-900">
                  <Phone size={14} className="text-gray-400" />
                  {application.phone || 'N/A'}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Location
                </label>
                <div className="flex items-center gap-2 text-gray-900">
                  <MapPin size={14} className="text-gray-400" />
                  {[application.city, application.state, application.country]
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
                {application.bio || 'No bio provided'}
              </p>
            </div>
          </section>

          {/* Card: Education & Expertise */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <GraduationCap size={20} className="text-blue-500" />
              Education & Expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Qualification
                </label>
                <p className="text-gray-900 font-medium">
                  {application.qualification || 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  University
                </label>
                <p className="text-gray-900 font-medium">
                  {application.university || 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Graduation Year
                </label>
                <p className="text-gray-900 font-medium">
                  {application.graduationYear || 'N/A'}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Domain
                </label>
                <p className="text-gray-900 font-medium">
                  {application.domain || 'N/A'}
                </p>
              </div>
            </div>
          </section>

          {/* Card: Branch Specific Details (Academic / Industry) */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-hidden relative">
            <div
              className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10 ${application.mentorType === 'Academic' ? 'bg-purple-500' : 'bg-indigo-500'}`}
            ></div>

            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Award
                size={20}
                className={
                  application.mentorType === 'Academic'
                    ? 'text-purple-500'
                    : 'text-indigo-500'
                }
              />
              {application.mentorType} Experience
            </h2>

            {application.mentorType === 'Academic' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Expertise
                  </label>
                  <p className="text-gray-900 font-medium">
                    {application.expertise || 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Academic Span Up to
                  </label>
                  <p className="text-gray-900 font-medium">
                    {application.academicSpan || 'N/A'}
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
                    {application.industryCategory || 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Current Role
                  </label>
                  <p className="text-gray-900 font-medium">
                    {application.currentRole || 'N/A'}
                  </p>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Guidance Areas
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {application.guidanceAreas?.map((area) => (
                      <span
                        key={area}
                        className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded text-xs font-medium"
                      >
                        {area}
                      </span>
                    )) || 'N/A'}
                  </div>
                </div>

                {application.skills && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 block">
                      Skills
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {application.skills.split(',').map((skill) => (
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

            {application.mentorType === 'Industry' && (
              <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col md:flex-row gap-8">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Total Experience
                  </label>
                  <p className="text-gray-900 font-medium">
                    {application.experienceYears} Years
                  </p>
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Experience Summary
                  </label>
                  <p className="text-gray-700 text-sm leading-relaxed mt-1">
                    {application.experienceSummary || 'N/A'}
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column - Availability & Docs */}
        <div className="space-y-8">
          {/* Card: Availability */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-green-500" />
              Availability
            </h2>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
                  Preferred Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {application.availableDays?.map((day) => (
                    <span
                      key={day}
                      className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded"
                    >
                      {day}
                    </span>
                  )) || 'N/A'}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
                  Time Slots
                </label>
                <div className="space-y-2">
                  {application.preferredTime?.map((slot) => (
                    <div
                      key={slot}
                      className="text-sm text-gray-700 bg-gray-50 p-2 rounded border border-gray-100"
                    >
                      {slot}
                    </div>
                  )) || 'N/A'}
                </div>
              </div>
            </div>
          </section>

          {/* Card: Socials & Video */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Globe size={20} className="text-blue-500" />
              Socials & Media
            </h2>
            <div className="space-y-3">
              {application.linkedin && (
                <a
                  href={application.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-all text-gray-700"
                >
                  <Linkedin size={18} />
                  <span className="text-sm font-medium">LinkedIn Profile</span>
                </a>
              )}
              {application.github && (
                <a
                  href={application.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-900 hover:text-white transition-all text-gray-700"
                >
                  <Github size={18} />
                  <span className="text-sm font-medium">GitHub Repository</span>
                </a>
              )}
              {application.personalWebsite && (
                <a
                  href={application.personalWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-all text-gray-700"
                >
                  <Globe size={18} />
                  <span className="text-sm font-medium">
                    Portfolio / Website
                  </span>
                </a>
              )}
              {application.demoVideoLink && (
                <a
                  href={application.demoVideoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all mt-4"
                >
                  <Video size={18} />
                  <span className="text-sm font-medium">Watch Demo Video</span>
                </a>
              )}
            </div>
          </section>

          {/* Card: Documents */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-orange-500" />
              Documents
            </h2>
            <ul className="space-y-3">
              {application.resume && (
                <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FileText size={16} className="text-gray-400" /> Resume
                  </span>
                  <span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    View
                  </span>
                </li>
              )}
              {application.certificate && (
                <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FileText size={16} className="text-gray-400" /> Certificate
                  </span>
                  <span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    View
                  </span>
                </li>
              )}
              {application.idProof && (
                <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FileText size={16} className="text-gray-400" /> ID Proof
                  </span>
                  <span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    View
                  </span>
                </li>
              )}
            </ul>
          </section>
        </div>
      </div>

      {/* Sticky Action Footer */}
      <div className="sticky bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 -mx-6 md:-mx-8 lg:-mx-12 px-6 shadow-lg z-20">
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
                {application.status === 'pending' && (
                  <>
                    <button
                      onClick={handleRequestChanges}
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
              </>
            )}

            {!showRejectInput && application.status === 'pending' && (
              <button
                onClick={handleApprove}
                className="px-6 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors text-sm flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <CheckCircle size={16} />
                Approve Application
              </button>
            )}
            {application.status !== 'pending' && !showRejectInput && (
              <span className="text-sm font-semibold text-gray-400 italic">
                This application has been {application.status.replace('_', ' ')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

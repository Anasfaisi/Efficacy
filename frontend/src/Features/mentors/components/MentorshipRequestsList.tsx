import React, { useEffect, useState } from 'react';
import { mentorshipApi } from '@/Services/mentorship.api';
import type { Mentorship } from '@/types/mentorship';
import { MentorshipStatus } from '@/types/mentorship';
import { Calendar, Check, X, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface MentorshipRequestsListProps {
    isPage?: boolean;
}

const MentorshipRequestsList: React.FC<MentorshipRequestsListProps> = ({
    isPage = false,
}) => {
    const [requests, setRequests] = useState<Mentorship[]>([]);
    const [loading, setLoading] = useState(true);

    const [filter, setFilter] = useState<
        'pending' | 'approved' | 'rejected' | 'all'
    >('pending');

    const [rejectModal, setRejectModal] = useState<{
        isOpen: boolean;
        requestId: string | null;
    }>({ isOpen: false, requestId: null });
    const [rejectReason, setRejectReason] = useState('');
    const [reApplyOption, setReApplyOption] = useState<'date' | 'days'>('days');
    const [reApplyValue, setReApplyValue] = useState('');

    const fetchRequests = async () => {
        try {
            const data = await mentorshipApi.getMentorRequests();
            // console.log(data, "mentorship from mentorshipRequestlist.tsx");
            setRequests(data);
        } catch (error) {
            console.error('Failed to fetch mentorship requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const openRejectModal = (id: string) => {
        setRejectModal({ isOpen: true, requestId: id });
        setRejectReason('');
        setReApplyValue('');
    };

    const closeRejectModal = () => {
        setRejectModal({ isOpen: false, requestId: null });
        setRejectReason('');
        setReApplyValue('');
    };

    const handleConfirmReject = async () => {
        if (!rejectModal.requestId) return;

        let suggestedDate: Date | undefined;
        if (reApplyValue) {
            if (reApplyOption === 'date') {
                suggestedDate = new Date(reApplyValue);
            } else {
                const days = parseInt(reApplyValue);
                if (!isNaN(days)) {
                    suggestedDate = new Date();
                    suggestedDate.setDate(suggestedDate.getDate() + days);
                }
            }
        }

        await handleRespond(
            rejectModal.requestId,
            'rejected',
            suggestedDate,
            rejectReason
        );
        closeRejectModal();
    };

    const handleRespond = async (
        id: string,
        status: 'mentor_accepted' | 'rejected',
        suggestedStartDate?: Date,
        reason?: string
    ) => {
        try {
            await mentorshipApi.respondToRequest(id, {
                status,
                suggestedStartDate,
                reason,
            });
            toast.success(
                `Request ${status === 'mentor_accepted' ? 'accepted' : 'rejected'}`
            );
            fetchRequests();
        } catch (error: any) {
            toast.error(error.message || 'Failed to respond to request');
        }
    };

    if (loading)
        return (
            <div className="p-8 text-center text-gray-500">
                Loading requests...
            </div>
        );

    const filteredRequests = requests.filter((r) => {
        if (filter === 'all') return true;
        if (filter === 'pending') return r.status === MentorshipStatus.PENDING;
        if (filter === 'approved')
            return (
                r.status === MentorshipStatus.MENTOR_ACCEPTED ||
                r.status === MentorshipStatus.PAYMENT_PENDING ||
                r.status === MentorshipStatus.ACTIVE
            );
        if (filter === 'rejected')
            return r.status === MentorshipStatus.REJECTED;
        return true;
    });

    return (
        <div
            className={`bg-white rounded-2xl border border-gray-200 p-6 shadow-sm ${!isPage ? 'mb-8' : ''}`}
        >
            {!isPage && (
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <AlertCircle className="text-indigo-600" size={20} />
                    Mentorship Requests
                </h3>
            )}

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {(['pending', 'approved', 'rejected', 'all'] as const).map(
                    (status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${
                                filter === status
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {status} (
                            {
                                requests.filter((r) => {
                                    if (status === 'all') return true;
                                    if (status === 'pending')
                                        return (
                                            r.status ===
                                            MentorshipStatus.PENDING
                                        );
                                    if (status === 'approved')
                                        return (
                                            r.status ===
                                                MentorshipStatus.MENTOR_ACCEPTED ||
                                            r.status ===
                                                MentorshipStatus.PAYMENT_PENDING ||
                                            r.status === MentorshipStatus.ACTIVE
                                        );
                                    if (status === 'rejected')
                                        return (
                                            r.status ===
                                            MentorshipStatus.REJECTED
                                        );
                                    return false;
                                }).length
                            }
                            )
                        </button>
                    )
                )}
            </div>

            {filteredRequests.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                        No {filter} requests found
                    </h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredRequests.map((req) => (
                        <div
                            key={req._id}
                            className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-4"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={
                                        req.userId?.profilePic ||
                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(req.userId?.name || 'User')}`
                                    }
                                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                    alt=""
                                />
                                <div>
                                    <p className="font-bold text-gray-900">
                                        {req.userId?.name || 'Anonymous User'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {req.userId?.email || ''}
                                    </p>
                                    <span
                                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md mt-1 inline-block ${
                                            req.status ===
                                            MentorshipStatus.PENDING
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : req.status ===
                                                    MentorshipStatus.ACTIVE
                                                  ? 'bg-green-100 text-green-700'
                                                  : req.status ===
                                                      MentorshipStatus.REJECTED
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        {req.status}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar
                                        size={14}
                                        className="text-indigo-600"
                                    />
                                    <span>
                                        Proposed:{' '}
                                        {req.proposedStartDate
                                            ? new Date(
                                                  req.proposedStartDate
                                              ).toLocaleDateString()
                                            : 'ASAP'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock
                                        size={14}
                                        className="text-indigo-600"
                                    />
                                    <span>
                                        1-Month Mentorship ({req.totalSessions}{' '}
                                        sessions)
                                    </span>
                                </div>
                            </div>

                            {req.status === MentorshipStatus.PENDING && (
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() =>
                                            handleRespond(
                                                req._id!,
                                                'mentor_accepted'
                                            )
                                        }
                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-bold shadow-sm shadow-green-100"
                                    >
                                        <Check size={16} /> Accept
                                    </button>
                                    <button
                                        onClick={() =>
                                            openRejectModal(req._id!)
                                        }
                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-bold"
                                    >
                                        <X size={16} /> Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Reject Modal */}
            {rejectModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Reject Request
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Please provide a reason. You can also suggest when
                            they can re-apply.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Reason for Rejection
                                </label>
                                <textarea
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm h-32 resize-none"
                                    placeholder="e.g. Schedule conflict, expertise mismatch..."
                                    value={rejectReason}
                                    onChange={(e) =>
                                        setRejectReason(e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Re-application Suggestion (Optional)
                                </label>
                                <div className="flex gap-2 mb-2 bg-gray-50 p-1 rounded-lg">
                                    <button
                                        onClick={() => setReApplyOption('days')}
                                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${reApplyOption === 'days' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Days from now
                                    </button>
                                    <button
                                        onClick={() => setReApplyOption('date')}
                                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${reApplyOption === 'date' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Specific Date
                                    </button>
                                </div>
                                {reApplyOption === 'days' ? (
                                    <div className="relative">
                                        <input
                                            type="number"
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm" // pl-3
                                            placeholder="e.g. 7"
                                            value={reApplyValue}
                                            onChange={(e) =>
                                                setReApplyValue(e.target.value)
                                            }
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                                            Days
                                        </div>
                                    </div>
                                ) : (
                                    <input
                                        type="date"
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                        value={reApplyValue}
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split('T')[0]
                                        }
                                        onChange={(e) =>
                                            setReApplyValue(e.target.value)
                                        }
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={closeRejectModal}
                                className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmReject}
                                disabled={!rejectReason}
                                className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 shadow-lg shadow-red-200"
                            >
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorshipRequestsList;

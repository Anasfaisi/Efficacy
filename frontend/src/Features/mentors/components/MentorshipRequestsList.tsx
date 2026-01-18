import React, { useEffect, useState } from 'react';
import { mentorshipApi } from '@/Services/mentorship.api';
import type { Mentorship } from '@/types/mentorship';
import { MentorshipStatus } from '@/types/mentorship';
import { Calendar, Check, X, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const MentorshipRequestsList: React.FC = () => {
    const [requests, setRequests] = useState<Mentorship[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const data = await mentorshipApi.getMentorRequests();
            console.log(data,"mentorship from mentorshipRequestlist.tsx");
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

    const handleRespond = async (
        id: string,
        status: 'mentor_accepted' | 'rejected',
    ) => {
        try {
            let suggestedStartDate: Date | undefined;
            let reason: string | undefined;

            if (status === 'mentor_accepted') {
                // For now, accept without suggesting date as default
            } else {
                reason =
                    window.prompt('Please provide a reason for rejection:') ||
                    'No reason provided';
            }

            await mentorshipApi.respondToRequest(id, {
                status,
                suggestedStartDate,
                reason,
            });
            toast.success(
                `Request ${status === 'mentor_accepted' ? 'accepted' : 'rejected'}`,
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

    const pendingRequests = requests.filter(
        (r) => r.status === MentorshipStatus.PENDING,
    );

    if (pendingRequests.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <AlertCircle className="text-indigo-600" size={20} />
                Mentorship Requests ({pendingRequests.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingRequests.map((req) => (
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
                                              req.proposedStartDate,
                                          ).toLocaleDateString()
                                        : 'ASAP'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock size={14} className="text-indigo-600" />
                                <span>
                                    1-Month Mentorship ({req.totalSessions}{' '}
                                    sessions)
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() =>
                                    handleRespond(req._id!, 'mentor_accepted')
                                }
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-bold shadow-sm shadow-green-100"
                            >
                                <Check size={16} /> Accept
                            </button>
                            <button
                                onClick={() =>
                                    handleRespond(req._id!, 'rejected')
                                }
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-bold"
                            >
                                <X size={16} /> Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MentorshipRequestsList;

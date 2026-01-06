import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { type Mentor } from '@/types/auth';
import { logout } from '@/redux/slices/authSlice';
import { XCircle, LogOut } from 'lucide-react';
import { mentorApi } from '@/Services/mentor.api';

export default function ApplicationRejected() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentUser } = useAppSelector((state) => state.auth);
    const [feedbackReason, setFeedbackReason] = useState<string | undefined>(
        (currentUser as Mentor)?.applicationFeedback,
    );

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const mentor = await mentorApi.getMentorProfile();
                if (mentor && mentor.applicationFeedback) {
                    setFeedbackReason(mentor.applicationFeedback);
                }
            } catch (error) {
                console.error('Failed to fetch mentor profile', error);
            }
        };

        if (currentUser?.role === 'mentor') {
            const mentor = currentUser as Mentor;
            const status = mentor.status;

            fetchProfile();

            if (status === 'pending') {
                navigate('/mentor/application-received');
            } else if (
                status === 'reapply' ||
                status === 'incomplete' ||
                !status
            ) {
                navigate('/mentor/onboarding');
            } else if (status === 'active' || status === 'approved') {
                navigate('/mentor/dashboard');
            }
        }
    }, [currentUser, navigate]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/mentor/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-red-100">
                <div className="mb-6 flex justify-center">
                    <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center animate-bounce">
                        <XCircle className="w-12 h-12 text-red-500" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                    Application Rejected
                </h2>
                <p className="text-slate-500 mb-6 leading-relaxed">
                    We regret to inform you that your application to join as a
                    mentor has been rejected.
                </p>

                {feedbackReason && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-8 text-left">
                        <h3 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">
                            Reason for Rejection
                        </h3>
                        <p className="text-red-900 text-sm font-medium">
                            {feedbackReason}
                        </p>
                    </div>
                )}

                <div className="text-sm text-slate-400 mb-8">
                    Thank you for your interest in Efficacy.
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </div>
    );
}

import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { logout } from '@/redux/slices/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import MentorDashboard from '@/Features/mentors/pages/MentorDashboard';
import { logoutApi } from '@/Services/user.api';
import ApplicationReceived from '@/Features/mentors/pages/ApplicationReceived';
import MentorOnboardingForm from '@/Features/mentors/layout/MentorOnboardingForm';
import MentorGuidelines from '@/Features/mentors/pages/MentorGuidelines';
import MentorApproved from '@/Features/mentors/pages/MentorApproved';
import ApplicationRejected from '@/Features/mentors/pages/ApplicationRejected';
import MentorProfilePage from '@/Features/mentors/pages/MentorProfilePage';
import MentorLayout from '@/Features/mentors/layout/MentorLayout';
import MentorMentorshipList from '@/Features/mentors/pages/MentorMentorshipList';
import MentorshipRequestsPage from '@/Features/mentors/pages/MentorshipRequestsPage';
import MentorWalletPage from '@/Features/mentors/pages/MentorWalletPage';
import NotFound from '@/Features/common/pages/NotFound';
import MentorMentorshipManagementPage from '@/Features/mentors/pages/MentorMentorshipManagementPage';
import MentorChatPage from '@/Features/mentors/pages/MentorChatPage';
import BookingRequestsPage from '@/Features/mentors/pages/BookingRequestsPage';

const Logout: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await logoutApi();
                dispatch(logout());
            } catch (error) {
                console.error('Logout failed:', error);
            }
        };
        performLogout();
    }, [dispatch]);

    return <Navigate to="/login" replace />;
};

const MentorRoutes: React.FC = () => {
    return (
        <Routes>
            <Route element={<MentorLayout />}>
                <Route path="dashboard" element={<MentorDashboard />} />
                <Route
                    path="students"
                    element={<div>Students Page (Placeholder)</div>}
                />
                <Route path="sessions" element={<MentorMentorshipList />} />
                <Route path="requests" element={<MentorshipRequestsPage />} />
                <Route path="booking-requests" element={<BookingRequestsPage />} />
                <Route path="wallet" element={<MentorWalletPage />} />
                <Route path="profile" element={<MentorProfilePage />} />
                <Route path="guidelines" element={<MentorGuidelines />} />
                <Route
                    path="mentorship/:id"
                    element={<MentorMentorshipManagementPage />}
                />
            </Route>

            <Route path="chat" element={<MentorChatPage />} />

            <Route
                path="application-received"
                element={<ApplicationReceived />}
            />
            <Route
                path="application-rejected"
                element={<ApplicationRejected />}
            />
            <Route path="onboarding" element={<MentorOnboardingForm />} />
            <Route path="approved" element={<MentorApproved />} />
            <Route path="logout" element={<Logout />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};
export default MentorRoutes;

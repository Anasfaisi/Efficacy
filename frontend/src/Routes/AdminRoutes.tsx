import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AdminDashboard from '@/Features/admin/pages/AdminDashboard';
import { useAppDispatch } from '@/redux/hooks';
import { logout } from '@/redux/slices/authSlice';
import { logoutApi } from '@/Services/user.api';
import AdminLayout from '@/Features/admin/layout/AdminLayout';
import MentorManagement from '@/Features/admin/mentorManagement/pages/MentorManagement';
import MentorReviewPage from '@/Features/admin/pages/MentorApplicationReviewPage';
import MentorApplicationsPage from '@/Features/admin/pages/MentorApplicationsListPage';
import UserManagement from '@/Features/admin/userManagement/pages/UserManagement';
import NotFound from '@/Features/common/pages/NotFound';
import AdminFinancialsPage from '@/Features/admin/pages/AdminFinancialsPage';
import AdminGamificationPage from '@/Features/admin/gamification/pages/AdminGamificationPage';
import AdminProfilePage from '@/Features/admin/pages/AdminProfilePage';
import MentorDetailPage from '@/Features/users/mentors/pages/MentorDetailPage';

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

const AdminRoutes: React.FC = () => {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="logout" element={<Logout />} />
                <Route path="mentorManagement" element={<MentorManagement />} />
                <Route
                    path="mentors/applications"
                    element={<MentorApplicationsPage />}
                />
                <Route
                    path="mentors/details/:id"
                    element={<MentorDetailPage />}
                />
                <Route
                    path="mentors/review/:id"
                    element={<MentorReviewPage />}
                />
                <Route path="financials" element={<AdminFinancialsPage />} />
                <Route
                    path="gamification"
                    element={<AdminGamificationPage />}
                />
                <Route path="userManagement" element={<UserManagement />} />
                <Route path="profile" element={<AdminProfilePage />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
